import { useState } from 'react';
import styles from './order.module.css';
import cn from 'classnames';
import { InputPhone } from '../common/inputPhone/inputPhone';
import { DocValues } from '../documents/document/docValues/docValues';
import { SelectReferenceInForm } from '../documents/document/selects/selectReferenceInForm/selectReferenceInForm';
import { TypeReference } from '@/app/interfaces/reference.interface';
import { OptionsForDocument } from '@/app/interfaces/document.interface';
import { useAppContext } from '@/app/context/app.context';
import { getOptionOfDocumentElements } from '@/app/service/documents/getOptionOfDocumentElements';
import { getDefinedItemIdForReceiver, getDefinedItemIdForSender } from '../documents/document/docValues/doc.values.functions';
import { InputForDate } from '../documents/document/inputs/inputForDate/inputForDate';
import { InputForTime } from '../documents/document/inputs/inputForTime/inputForTime';
import { CheckBoxInTable } from '../documents/document/inputs/checkBoxInForm/checkBoxInForm';
import { InputInForm } from '../documents/document/inputs/inputInForm/inputInForm';
import { numberValue } from '@/app/service/common/converters';

export default function Order() {
  const [activeContent, setActiveContent] = useState(1);

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
  const role = user?.role;
  const storageIdFromUser = user?.sectionId;
  
  let options: OptionsForDocument = getOptionOfDocumentElements(contentName)

  let definedItemIdForReceiver = getDefinedItemIdForReceiver(role, storageIdFromUser, contentName)
  let definedItemIdForSender = getDefinedItemIdForSender(role, storageIdFromUser, contentName)

  const labelForDate = currentDocument.docValues.orderWithDeleviry ? 'Етказ. бериш санаси' : 'Олиб кетиш санаси'
  const labelForTime = currentDocument.docValues.orderWithDeleviry ? 'Етказ. бериш вакти' : 'Олиб кетиш вакти'

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.mainTitle}>Янги буюртма</div>

        { activeContent == 1 && 
          (
            <div className={styles.findBox}>
              <InputPhone label=''/>
              <button className={cn(styles.button, styles.btnFind)} onClick={handleNextClick}>Мижозни топиш</button>
            </div>
          )
        }

        { activeContent == 2 && 
          ( <>
              <div className={styles.dataBoxForOrder}>
                <InputForDate label={labelForDate} id='orderTakingDate'/>
                <InputForTime label={labelForTime}/>    
              </div>
              <div className={styles.deleviryBox}>
                  <CheckBoxInTable label = 'Ектазиб бериш билан бирга' id={'orderWithDeleviry'}/>
                  <InputInForm 
                      nameControl='orderAdress' 
                      type='text' 
                      label='' 
                      visible={currentDocument.docValues.orderWithDeleviry} 
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
              label={'Юк берувчи цех'} 
              typeReference={TypeReference.STORAGES}
              visibile={true}
              currentItemId={currentDocument?.docValues.senderId}
              type='sender'
              definedItemId= {definedItemIdForSender}
          />
        }

        { activeContent == 4 && 
          <SelectReferenceInForm 
              label={'Махсулот'} 
              typeReference= {TypeReference.TMZ}
              visibile={true}
              currentItemId={currentDocument?.docValues.analiticId}
              type='analitic'
          />
        }

        { activeContent == 5 && 
          <InputInForm 
            nameControl='count' 
            type='number' 
            label='Сон' 
            visible={true} 
          />
        }

        { activeContent == 6 && 
          <InputInForm 
            nameControl='price' 
            type='number' 
            label='Нархи' 
            visible={true} 
          />
        }

        { activeContent == 7 && 
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

        { activeContent == 8 && 
          <>
            <InputInForm nameControl='comment' type='text' label='Изох' visible={true}/>
            <button 
              className={cn(styles.button, styles.btnPrev)}
              onClick={handlePrevClick}>
                {`<==`}
            </button>
          </>
        }

        {activeContent > 1 && activeContent < 8 &&  (
          <div className={styles.btnBox}>
            <button 
              className={cn(styles.button, styles.btnPrev)}
              onClick={handlePrevClick}>
                {`<==`}
            </button>
            <button 
              className={cn(styles.button, styles.btnNext)}
              onClick={handleNextClick}>
                {`=>>`}
            </button>
          </div>
        )}

        <div className={styles.orderBox}>
          <div className={styles.title}>"Шавкат нон" буюртма чеки</div>
          <div className={styles.timeAndDate}>
            <div>{currentDocument.docValues.orderTakingDate}</div>
            <div>{currentDocument.docValues.orderTakingTime}</div>
          </div>
          <div className={styles.infoBox}>
            <p>Мижоз:</p>
            <div>{currentDocument.docValues.receiverId}</div>
          </div>
          <div className={styles.infoBox}>
            <p>Тел.:</p>
            <div>{currentDocument.docValues.receiverId}</div>
          </div>
          <div className={styles.infoBox}>
            <p>Цех:</p>
            <div>{currentDocument.docValues.receiverId}</div>
          </div>
          <div className={styles.infoBox}>
            <p>Махсулот:</p>
            <div>{currentDocument.docValues.analiticId}</div>
          </div>
          <div className={styles.infoBox}>
            <p>Сумма</p>
            <div>{numberValue(currentDocument.docValues.count)} x {numberValue(currentDocument.docValues.price)} = {numberValue(currentDocument.docValues.total)}</div>
          </div>
          <div className={styles.infoBox}>
            <p>Аванс</p>
            <div>{numberValue(currentDocument.docValues.cashFromPartner)}</div>
          </div>
          <div className={styles.infoBox}>
            <p>Колдик</p>
            <div>
              { currentDocument.docValues.cashFromPartner ? numberValue(currentDocument.docValues.total - currentDocument.docValues.cashFromPartner) 
                : numberValue(currentDocument.docValues.total)
              }
            </div>
          </div>
          <div className={styles.infoBox}>
            <p>Изох</p>
            <div>{currentDocument.docValues.comment}</div>
          </div>
          {
            currentDocument.docValues.orderWithDeleviry && 
            <div className={styles.infoBox}>
              <p>Етказ. манзили</p>
              <div>{currentDocument.docValues.orderAdress}</div>
            </div>  
          }
          
        </div>
        
        <div className={styles.submitBox}>
          <button className={cn(styles.button, styles.btnSend)} onClick={handleNextClick}>Тасдиклаш</button>
        </div>

        {/* <DocValues/> */}
      </div>
    </div>
  );
}