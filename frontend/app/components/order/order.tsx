import { useEffect, useState } from 'react';
import styles from './order.module.css';
import cn from 'classnames';
import { InputPhone } from '../common/inputPhone/inputPhone';
import { SelectReferenceInForm } from '../documents/document/selects/selectReferenceInForm/selectReferenceInForm';
import { TypeReference } from '@/app/interfaces/reference.interface';
import { DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { useAppContext } from '@/app/context/app.context';
import { getDefinedItemIdForSender } from '../documents/document/docValues/doc.values.functions';
import { InputForDate } from '../documents/document/inputs/inputForDate/inputForDate';
import { InputForTime } from '../documents/document/inputs/inputForTime/inputForTime';
import { CheckBoxInTable } from '../documents/document/inputs/checkBoxInForm/checkBoxInForm';
import { InputInForm } from '../documents/document/inputs/inputInForm/inputInForm';
import { Ticket } from './helpers/ticket';
import { getClientIdByPhone } from '@/app/service/references/getClientIdByPhone';
import { InputName } from '../common/inputName/inputName';
import { showMessage } from '@/app/service/common/showMessage';
import { getNewClientId } from '@/app/service/references/getNewClientId';
import { defaultDocument } from '@/app/context/app.context.constants';
import { validateBody } from '@/app/service/documents/validateBody';
import { OrderStatus } from '@/app/interfaces/order.interface';
import { updateCreateDocument } from '@/app/service/documents/updateCreateDocument';

export default function Order() {
  const [activeContent, setActiveContent] = useState(1);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [showAddBtn, setShowAddBtn] = useState(false)

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

  const labelForDate = currentDocument.docValues?.orderWithDeleviry ? 'Етказ. бериш санаси' : 'Олиб кетиш санаси'
  const labelForTime = currentDocument.docValues?.orderWithDeleviry ? 'Етказ. бериш вакти' : 'Олиб кетиш вакти'

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
        setName('')
        clientId = await getClientIdByPhone(phone, setMainData, token);
      } else {
        if (!name) {
          showMessage('Исм киритилмаган','warm',setMainData)
          return
        }

        if (!phone) {
          showMessage('Тел ракам киритилмаган','warm',setMainData)
          return
        }

        clientId = await getNewClientId(name, phone, setMainData, token)
        setName('')
        setPhone('')
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
        setShowAddBtn(false)
      } else {
        setShowAddBtn(true)
      }

    } catch (error) {
      console.error('Error:', error);
    }
  }

  const submitOrder = () => {
    
    let body: DocumentModel = {
        ...currentDocument,
        date: Date.now(),
        documentType: DocumentType.Order,
        docValues: {
          ...currentDocument.docValues,
          orderStatus : OrderStatus.OPEN
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
              <button className={cn(styles.button, styles.btnFind)} onClick={() => searchOrAddNewClient('find', name, phone, token, setMainData)}>Мижозни топиш</button>
              {
                showAddBtn &&
                <>
                  <InputName label='' name={name} setName={setName}/>
                  <button className={cn(styles.button, styles.btnAdd)} onClick={() => searchOrAddNewClient('add', name, phone, token, setMainData)}>Янги мижоз кушиш</button>
                </>
              }  
            </div>
          )
        }

        { activeContent == 2 && 
          ( <>
              <div className={styles.dataBoxForOrder}>
                <InputForDate label={labelForDate} id='orderTakingDate'/>
                <InputForTime label={labelForTime} id='orderTakingTime'/>    
              </div>
              <div className={styles.deleviryBox}>
                  <CheckBoxInTable label = 'Ектазиб бериш билан бирга' id={'orderWithDeleviry'}/>
                  <InputInForm 
                      nameControl='orderAdress' 
                      type='text' 
                      label='' 
                      visible={currentDocument.docValues?.orderWithDeleviry} 
                      isNewDocument
                      disabled ={false}
                      placeholder='Ектазиб бериш манзили'
                      />
              </div>
            </>
            
          )
        }

        { activeContent == 3 && 
          <SelectReferenceInForm 
              label={'Махсулот'} 
              typeReference= {TypeReference.TMZ}
              visibile={true}
              currentItemId={currentDocument?.docValues.analiticId}
              type='analitic'
          />
        }

        { activeContent == 4 && 
          <InputInForm 
            nameControl='count' 
            type='number' 
            label='Сон' 
            visible={true} 
          />
        }

        { activeContent == 5 && 
          <InputInForm 
            nameControl='price' 
            type='number' 
            label='Нархи' 
            visible={true} 
          />
        }

        { activeContent == 6 && 
          <>
             <InputInForm 
                nameControl='cashFromPartner' 
                type='number' 
                label={'Аванс'} 
                visible={true}
                disabled={false}
              />
          </>
        }

        { activeContent == 7 && 
          <>
            <InputInForm nameControl='comment' type='text' label='Изох' visible={true}/>
            <button 
              className={cn(styles.button, styles.btnPrev)}
              onClick={handlePrevClick}>
                {`<<==`}
            </button>
          </>
        }

        {activeContent > 1 && activeContent < 7 &&  (
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

        <Ticket/>
                
        <div className={styles.submitBox}>
          <button className={cn(styles.button, styles.btnSend)} onClick={() => submitOrder()}>Тасдиклаш</button>
        </div>

      </div>
    </div>
  );
}