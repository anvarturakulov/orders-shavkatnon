import axios from 'axios';
import { showMessage } from '../common/showMessage';
import { Maindata } from '@/app/context/app.context.interfaces';
import { DocSTATUS, DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { defaultDocument, defaultDocumentTableItem, defaultDocValue } from '@/app/context/app.context.constants';
import { workersUsersList } from '@/app/interfaces/user.interface';

export const updateCreateDocument = (body: DocumentModel, mainData: Maindata, setMainData: Function | undefined) => {
  const { user } = mainData.users
  const { currentDocument } = mainData.document
  const { isNewDocument, contentName } = mainData.window

  // let body: DocumentModel = {
  //   ...currentDocument,
  // }
  
   if (body.docValues.analiticId != undefined && body.docValues.analiticId <= 0) {
    let newDocValues = {...body.docValues}
    delete newDocValues.analiticId
    body = {
      ...body,
      docValues: {...newDocValues}
    }
  }
  
  if (body.documentType == DocumentType.Order) {
    body.docStatus = DocSTATUS.OPEN
  } else {
    body.docStatus = DocSTATUS.PROVEDEN
  } 

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  const actionWithMainData = (mes: string) => {
    if (setMainData) {
      showMessage(`${mes}`, 'success', setMainData)
      setMainData('clearControlElements', true);
      setMainData('showDocumentWindow', false);
      setMainData('isNewDocument', false);
      const defValue:DocumentModel = {
        ...defaultDocument,
        docValues: {...defaultDocValue},
        docTableItems: [defaultDocumentTableItem]
      }
      setMainData('currentDocument', { ...defValue });
      setMainData('docValues', { ...defaultDocValue });

      if (user && workersUsersList.includes(user?.role)) {
        setMainData('mainPage', true);
      }
    }
  }

  const uriPost = process.env.NEXT_PUBLIC_DOMAIN + '/api/documents/create';
  axios.post(uriPost, body, config)
    .then(function (request) {
      actionWithMainData('янги хужжати киритилди')
    })
    .catch(function (error) {
      if (setMainData) {
        showMessage(error.message, 'error', setMainData)
      }
    });
  
}