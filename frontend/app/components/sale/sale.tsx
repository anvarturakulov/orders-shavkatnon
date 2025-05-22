import { useEffect, useState } from 'react';
import styles from './sale.module.css';
import cn from 'classnames';
import { InputPhone } from '../common/inputPhone/inputPhone';
import { DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { useAppContext } from '@/app/context/app.context';
import { getDefinedItemIdForSender } from '../documents/document/docValues/doc.values.functions';
import { InputInForm } from '../documents/document/inputs/inputInForm/inputInForm';
import { getClientIdByPhone } from '@/app/service/references/getClientIdByPhone';
import { showMessage } from '@/app/service/common/showMessage';
import { defaultDocument } from '@/app/context/app.context.constants';
import { validateBody } from '@/app/service/documents/validateBody';
import { updateCreateDocument } from '@/app/service/documents/updateCreateDocument';
import { TicketForSale } from './helpers/saleTicket';
import { SelectReferenceInForm } from '../documents/document/selects/selectReferenceInForm/selectReferenceInForm';
import { TypeReference } from '@/app/interfaces/reference.interface';

export default function Sale() {
  const [activeContent, setActiveContent] = useState(1);
  const [phone, setPhone] = useState('');

  const handleNextClick = () => {
    setActiveContent(activeContent + 1);
  };

  const handlePrevClick = () => {
    setActiveContent(activeContent - 1);
  };

  const {mainData, setMainData} = useAppContext();
  const { currentDocument} = mainData.document;
  const { user } = mainData.users;
  const token = user?.token
  const role = user?.role;
  const storageIdFromUser = user?.sectionId;

  useEffect(() => {
    if (setMainData) {
      setMainData('currentDocument', {...defaultDocument});
    }
  },[])

  const searchOrAddNewClient = async (action: 'find'| 'add', name: string, phone: string, token: string | undefined, setMainData: Function | undefined) => {
    try {
      let clientId = 0
      if (action == 'find') {
        if (!phone) {
          showMessage('Тел ракам киритилмаган','warm',setMainData)
          return
        }
        clientId = await getClientIdByPhone(phone, setMainData, token);
      } 

      const definedItemIdForSender = getDefinedItemIdForSender(role, storageIdFromUser, DocumentType.Order) 

      const newCurrentDocument:DocumentModel = {
        ...currentDocument,
        docValues: {
          ...currentDocument.docValues,
          receiverId: clientId,
          senderId: definedItemIdForSender
        }
      }

      if (setMainData) {
        setMainData('currentDocument', {...newCurrentDocument});
      }

      if (clientId) {
        handleNextClick()
      } else {
        showMessage('Мижоз топилмади', 'warm', setMainData)
      }

    } catch (error) {
      console.error('Error:', error);
    }
  }

  const submitOrder = () => {
    
    let body: DocumentModel = {
        ...currentDocument,
        date: Date.now(),
        documentType: DocumentType.SaleProdByOrder,
        docValues: {
          ...currentDocument.docValues,
        }
    }
    if (user?.id) body.userId = user.id
    
    if (!validateBody(body)) {
        // console.log(body)
        showMessage('Хужжатни тулдиришда хатолик бор.', 'error', setMainData);
    } else {
        updateCreateDocument(body, mainData, setMainData);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        { activeContent == 1 && 
          (
            <div className={styles.findBox}>
              <InputPhone label='' phone={phone} setPhone={setPhone}/>
              <button className={cn(styles.button, styles.btnFind)} onClick={() => searchOrAddNewClient('find', '', phone, token, setMainData)}>Мижозни топиш</button>
                
            </div>
          )
        }
        
        { activeContent == 2 && 
          <SelectReferenceInForm 
              label={'Махсулот'} 
              typeReference= {TypeReference.TMZ}
              visibile={true}
              currentItemId={currentDocument?.docValues.analiticId}
              type='analitic'
          />
        }

        { activeContent == 3 && 
          <InputInForm 
            nameControl='count' 
            type='number' 
            label='Сон' 
            visible={true} 
          />
        }

        { activeContent == 4 && 
          <>
            <InputInForm 
            nameControl='price' 
            type='number' 
            label='Нархи' 
            visible={true} 
          />
            <button 
              className={cn(styles.button, styles.btnPrev)}
              onClick={handlePrevClick}>
                {`<<==`}
            </button>
          </>
        }

        {activeContent > 1 && activeContent < 4 &&  (
          <div className={styles.btnBox}>
            <button 
              className={cn(styles.button, styles.btnPrev)}
              onClick={handlePrevClick}>
                {`<<==`}
            </button>
            <button 
              className={cn(styles.button, styles.btnNext)}
              onClick={handleNextClick}>
                {`==>>`}
            </button>
          </div>
        )}


        <TicketForSale/>
                
        <div className={styles.submitBox}>
          <button className={cn(styles.button, styles.btnSend)} onClick={() => submitOrder()}>Тасдиклаш</button>
        </div>

      </div>
    </div>
  );
}