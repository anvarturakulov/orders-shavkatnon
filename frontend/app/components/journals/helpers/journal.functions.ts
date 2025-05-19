import { Maindata } from '@/app/context/app.context.interfaces';
import { DocSTATUS, DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { ReferenceModel, TypeSECTION } from '@/app/interfaces/reference.interface';
import { UserRoles } from '@/app/interfaces/user.interface';
import { markToDeleteDocument } from '@/app/service/documents/markToDeleteDocument';
import { setProvodkaToDocument } from '@/app/service/documents/setProvodkaToDocument';

export const getNameReference = (references: any, id: number | undefined | null): string => {
  if (references && references.length > 0) {
    return references.filter((item: ReferenceModel) => item.id == id)[0]?.name
  }
  return '-'
}

export const getPhoneReference = (references: any, id: number | undefined | null): string => {
  if (references && references.length > 0) {
    return references.filter((item: ReferenceModel) => item.id == id)[0]?.refValues?.phone
  }
  return '-'
}

export const getUserName = (id: number, mainData: Maindata): string => {
  const { usersName } = mainData.users
  if (usersName && usersName.length > 0) {
    return usersName.filter((item) => item?.id == id)[0]?.name
  }
  
  return 'Аникланмади'
}

export const deleteItemDocument = (docStatus: DocSTATUS, id: number | undefined, docDate: number| undefined, token: string | undefined, setMainData: Function | undefined, mainData: Maindata) => {
  const { user } = mainData.users

  if (
    (user?.role == UserRoles.ADMIN || 
    user?.role == UserRoles.HEADCOMPANY ||
    user?.role == UserRoles.HEADSECTION ) &&
    (docStatus == DocSTATUS.DELETED || docStatus == DocSTATUS.OPEN)
  ) {
    markToDeleteDocument(id, setMainData, token)
  } else {
    alert('Узр. Факат админлар учириш хукукига эга')
  }
}

export const setProvodkaToDoc = (id: number | undefined, token: string | undefined, docStatus: DocSTATUS, setMainData: Function | undefined, mainData: Maindata, receiverId: number | undefined, senderId: number | undefined) => {
  if (docStatus == DocSTATUS.OPEN) {
    let yes = confirm('Заказ бажарилдими')
    const { user } = mainData.users

    if (
        yes && 
        ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY ) || 
        ( user?.sectionId == receiverId && user?.sectionId != senderId)
    ){
      setProvodkaToDocument(id, setMainData, mainData)
    } else {
      alert('Узр. Сиз ушбу заказ холатини узгартира олмайсиз')
    }
  } else {
    alert('Аввал, хужжат холатини узгартиринг')
  }
}

export const getTotalValueForDocument = (document: DocumentModel): number => {
  return document.docValues.total;
}

export const getDocStatus = (docStatus: DocSTATUS): string => {
  switch (docStatus) {
      case DocSTATUS.DELETED:
        return 'Учирилган'
      case DocSTATUS.PROVEDEN:
        return 'Бажарилган'
      case DocSTATUS.OPEN:
        return 'Очик'
      default:
        return 'Ижрода'
    }
}

export const remainOneDay = (dateOrder: number | undefined): boolean => {
  if (dateOrder == undefined) return false
  const oneDay = (24 * 60 * 60 * 1000)
  const now = Date.now()
  const remainDate = dateOrder - now 
  return (oneDay > remainDate) ? true : false
}