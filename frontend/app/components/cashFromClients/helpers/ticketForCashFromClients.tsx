import { useAppContext } from '@/app/context/app.context';
import styles from './helpers.module.css';
import { getNameReference, getPhoneReference } from '../../journals/helpers/journal.functions';
import { numberValue } from '@/app/service/common/converters';
import useSWR from 'swr';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { useEffect } from 'react';

export const TicketForCashFromClients = () => {
    
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
          <div className={styles.title}>"Шавкат нон" мижоздан пул олиш чеки</div>
          <div className={styles.infoBox}>
            <p>Мижоз:</p>
            <div>{currentDocument.docValues.receiverId ? getNameReference(references, currentDocument.docValues.senderId) : ''}</div>
          </div>
          <div className={styles.infoBox}>
            <p>Тел.:</p>
            <div>{currentDocument.docValues.receiverId ? getPhoneReference(references, currentDocument.docValues.senderId) : ''}</div>
          </div>
          <div className={styles.infoBox}>
            <p>Цех:</p>
            <div>{getNameReference(references, currentDocument.docValues.senderId)}</div>
          </div>
          <div className={styles.infoBox}>
            <p>Аванс</p>
            <div>{numberValue(currentDocument.docValues.total)}</div>
          </div>
          <div className={styles.infoBox}>
            <p>Изох</p>
            <div>{currentDocument.docValues.comment}</div>
          </div>
        </div>
    )
}