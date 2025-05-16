import { useAppContext } from '@/app/context/app.context';
import { secondsToDateString } from '../../documents/document/doc/helpers/doc.functions';
import styles from './helpers.module.css';
import { getNameReference, getPhoneReference } from '../../journals/helpers/journal.functions';
import { numberValue } from '@/app/service/common/converters';
import useSWR from 'swr';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { useEffect } from 'react';

export const Ticket = () => {
    
    const {mainData, setMainData} = useAppContext();
    const { currentDocument} = mainData.document;
    const { user } = mainData.users;
    const token = user?.token
    
    const urlReferences = process.env.NEXT_PUBLIC_DOMAIN+'/api/references/all/';
    const { data : references, mutate: mutateReferences } = useSWR(urlReferences, (urlReferences) => getDataForSwr(urlReferences, token));
    
    useEffect(() => {
        mutateReferences()
    }, [currentDocument.docValues.receiverId])

    return (
        <div className={styles.orderBox}>
          <div className={styles.title}>"Шавкат нон" буюртма чеки</div>
          <div className={styles.timeAndDate}>
            <div>Сана: <span>{secondsToDateString(currentDocument.docValues?.orderTakingDate)}</span></div>
            <div>вакти: <span>{currentDocument.docValues?.orderTakingTime}</span></div>
          </div>
          <div className={styles.infoBox}>
            <p>Мижоз:</p>
            <div>{currentDocument.docValues.receiverId ? getNameReference(references, currentDocument.docValues.receiverId) : ''}</div>
          </div>
          <div className={styles.infoBox}>
            <p>Тел.:</p>
            <div>{currentDocument.docValues.receiverId ? getPhoneReference(references, currentDocument.docValues.receiverId) : ''}</div>
          </div>
          <div className={styles.infoBox}>
            <p>Цех:</p>
            <div>{getNameReference(references, currentDocument.docValues.senderId)}</div>
          </div>
          <div className={styles.infoBox}>
            <p>Махсулот:</p>
            <div>{getNameReference(references, currentDocument.docValues.analiticId)}</div>
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
    )
}