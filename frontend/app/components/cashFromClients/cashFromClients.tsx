import { useEffect, useState } from 'react';
import styles from './cashFromClients.module.css';
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
import { TicketForCashFromClients } from './helpers/ticketForCashFromClients';

export default function CashFromClients() {
  const [activeContent, setActiveContent] = useState(1);
  const [phone, setPhone] = useState('');

  const handleNextClick = () => {
    setActiveContent(activeContent + 1);
  };

  const handlePrevClick = () => {
    setActiveContent(activeContent - 1);
  };

  const {mainData, setMainData} = useAppContext();
  const { contentName, isNewDocument, contentTitle } = mainData.window;
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
          receiverId: definedItemIdForSender,
          senderId: clientId
        }
      }

      if (setMainData) {
        setMainData('currentDocument', {...newCurrentDocument});
      }

      if (clientId) {
        handleNextClick()
      }

    } catch (error) {
      console.error('Error:', error);
    }
  }

  const submitOrder = () => {
    
    let body: DocumentModel = {
        ...currentDocument,
        date: Date.now(),
        documentType: DocumentType.ComeCashFromClients,
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
          <InputInForm 
            nameControl='total' 
            type='number' 
            label={'Аванс'} 
            visible={true}
            disabled={false}
          />
        }

        { activeContent == 3 && 
          <>
            <InputInForm nameControl='comment' type='text' label='Изох' visible={true}/>
            <button 
              className={cn(styles.button, styles.btnPrev)}
              onClick={handlePrevClick}>
                {`<<==`}
            </button>
          </>
        }

        {activeContent > 1 && activeContent < 3 &&  (
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

        <TicketForCashFromClients/>
                
        <div className={styles.submitBox}>
          <button className={cn(styles.button, styles.btnSend)} onClick={() => submitOrder()}>Тасдиклаш</button>
        </div>

      </div>
    </div>
  );
}