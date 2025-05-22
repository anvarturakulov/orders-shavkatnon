import { Maindata } from '@/app/context/app.context.interfaces'
import { DocTableItem, DocumentModel, DocumentType, OptionsForDocument } from '@/app/interfaces/document.interface'
import { TypeReference } from '@/app/interfaces/reference.interface'
import { User, UserRoles } from '@/app/interfaces/user.interface'

export const getLabelForAnalitic = (currentDocument: DocumentModel, options: OptionsForDocument): string => {
  
  let {isPartner, isWorker} = currentDocument.docValues

  if (currentDocument && isPartner) {
    return 'Хамкор'
  }
  if (currentDocument && isWorker) {
    'Ходим'
  }
  return options.analiticLabel
}

export const getTypeReferenceForAnalitic = (currentDocument: DocumentModel, options: OptionsForDocument) => {
  let {isPartner, isWorker} = currentDocument.docValues

  if (currentDocument && isPartner) {
    return TypeReference.PARTNERS
  }
  if (currentDocument && isWorker) {
    return TypeReference.WORKERS
  }
  return options.analiticType
}


export const saveItemId = (storageId: number | undefined, type: 'reciever' | 'sender', mainData: Maindata, setMainData: Function | undefined,) => {
  let currentItem = { ...mainData.document.currentDocument };
  
  if (storageId && type == 'reciever') currentItem.docValues.receiverId = storageId
  if (storageId && type == 'sender') currentItem.docValues.senderId = storageId

  if (setMainData) {
    setMainData('currentDocument', { ...currentItem })
  }
}

export const getDefinedItemIdForReceiver = (role: UserRoles | undefined, storageIdFromUser: number | undefined, contentName: string) => {
  if (role && role == UserRoles.GLBUX && contentName == DocumentType.ZpCalculate) return 0
  
  if (role == UserRoles.ADMIN || role == UserRoles.HEADCOMPANY) return 0
  
  if (contentName == DocumentType.ComeMaterial) return storageIdFromUser
  
  if (role && (role == UserRoles.TANDIR || contentName == DocumentType.ComeHalfstuff)) {
    return storageIdFromUser
  }
  
  if (
      storageIdFromUser && 
      role &&
      role !== UserRoles.ZAMGLBUX && 
      role !== UserRoles.GLBUX && 
      ( 
        contentName == DocumentType.ComeCashFromPartners ||
        contentName == DocumentType.LeaveCash
      ) 
  ) return storageIdFromUser
  


  return 0
}

export const getDefinedItemIdForSender = (role: UserRoles | undefined, storageIdFromUser: number | undefined, contentName: string) => {
  if (role == UserRoles.ADMIN || role == UserRoles.HEADCOMPANY) return 0
  
  if (
    (storageIdFromUser && role) &&
    (contentName == DocumentType.Order ||
    contentName == DocumentType.ComeCashFromClients || 
    contentName == DocumentType.SaleProdByOrder) 
  ) return storageIdFromUser

  return 0
}

export const addItems = (setMainData: Function | undefined, mainData: Maindata, newItem: DocTableItem) => {

  let newObj = { ...mainData.document.currentDocument };
  newObj.docTableItems?.push(newItem)

  if (setMainData) {
    setMainData('currentDocument', { ...newObj })
  }
}