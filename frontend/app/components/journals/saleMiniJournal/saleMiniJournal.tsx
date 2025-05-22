'use client'
import styles from './saleMiniJournal.module.css'
import IcoTrash from './ico/trash.svg'
import IcoSave from './ico/save.svg'
import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import cn from 'classnames';
import Header from '../../common/header/header';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { deleteItemDocument, getDocStatus, getNameReference, getPhoneReference, remainOneDay, setProvodkaToDoc } from '../helpers/journal.functions';
import { DocSTATUS, DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { dateNumberToString } from '@/app/service/common/converterForDates'
import Footer from '../../common/footer/footer'
import { numberValue } from '@/app/service/common/converters'
import { dashboardUsersList, UserRoles } from '@/app/interfaces/user.interface'
import { secondsToDateString } from '../../documents/document/doc/helpers/doc.functions'
import { SaleMiniJournalProps } from './saleMiniJournal.props'
import { defineUrlTypeForOrder } from '@/app/service/orders/defineUrlTypeForOrder';

interface FilterForJournal {
    takingDate: string,
    count: string
    analitic: string,
    summa: string,
    receiver: string,
    sender: string,
    deleviry: string,
    comment: string,
    user: string,
}
    
const defaultFilter: FilterForJournal = {
    summa: 'Сумма',
    receiver: 'Олувчи',
    sender: 'Берувчи',
    analitic: 'Аналитика',
    comment: 'Изох',
    user: 'Фойдаланувчи',
    takingDate: 'Бюртма санаси',
    count: 'Сон',
    deleviry: 'Етказиб бориш бор'
}

const documentTotal = (item: DocumentModel) => {
    return numberValue(item.docValues?.total)
}

const totals = (item: DocumentModel) => {
    let total = item.docValues?.total;
    let count = item.docValues?.count;
    return {t: total, c:count}
}

export default function SaleMiniJournal({ className, ...props}:SaleMiniJournalProps):JSX.Element {
    
    const {mainData, setMainData} = useAppContext();
    const {dateStart, dateEnd} = mainData.window.interval;
    const { updateDataForDocumentJournal } = mainData.journal;

    let dateStartForUrl = dateStart
    let dateEndForUrl = dateEnd

    if (!dateStart && !dateEnd) {
        let now = Date.now()+18000000
        let nowInstr = dateNumberToString(now)
        dateStartForUrl = Date.parse(nowInstr)
        dateEndForUrl = Date.parse(nowInstr) + 86399999
    }
    
    const [filter, setFilter] = useState<FilterForJournal>(defaultFilter);

    const { user } = mainData.users;
    const { showDocumentWindow, contentName } = mainData.window;
    const role = user?.role;
    const dashboardUsers = role && dashboardUsersList.includes(role);

    const token = user?.token;
    const urlType = defineUrlTypeForOrder(contentName)
    
    let url = process.env.NEXT_PUBLIC_DOMAIN+'/api/documents/byTypeForDate'+'?documentType='+DocumentType.SaleProdByOrder+'&dateStart='+dateStartForUrl+'&dateEnd='+dateEndForUrl;
    
    const urlReferences = process.env.NEXT_PUBLIC_DOMAIN+'/api/references/all/';

    const { data : documents, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    const { data : references, mutate: mutateReferences } = useSWR(urlReferences, (urlReferences) => getDataForSwr(urlReferences, token));
    
    useEffect(() => {
        mutate()
        mutateReferences()
        setMainData && setMainData('updateDataForDocumentJournal', false);
    }, [showDocumentWindow, updateDataForDocumentJournal])
    
    let count:number = 0;
    let total: number = 0;
    let docCount: number = 0;

    const filteredDocuments = useMemo(() => {
        return (
            documents && documents.length > 0 &&
            documents
                .sort((a: DocumentModel, b: DocumentModel) => {
                    let dateComparison
                    if (a.docValues.orderTakingDate && b.docValues.orderTakingDate) {
                        dateComparison = a.docValues.orderTakingDate - b.docValues.orderTakingDate;
                        if (dateComparison) {
                            return a.docValues.orderTakingDate - b.docValues.orderTakingDate;
                        }
                    } else {
                        if (a.id && b.id) {
                            dateComparison = a.id - b.id;
                            if (dateComparison) {
                                return a.id - b.id;
                            }
                        }
                    }
                })
                
        );
    }, [documents, filter, references, mainData]);

    return (
        <>
            {dashboardUsers && <Header windowFor='document' total={total} count={count}/>}  
            {
                dashboardUsers && 
                <div className={styles.container} >
                    <table className={styles.table}>
                        
                        <tbody className={styles.tbody}>
                            {filteredDocuments && 
                                filteredDocuments.map((item:DocumentModel, key: number) => {
                                    let {t, c} = totals(item)
                                    total += item.docStatus != DocSTATUS.DELETED ? t : 0;
                                    count += item.docStatus != DocSTATUS.DELETED ? c : 0;
                                    docCount += item.docStatus != DocSTATUS.DELETED ? 1 : 0;
                                    return (
                                        <tr 
                                            key={key} 
                                            className={cn(className,{
                                                [styles.yellow]: (remainOneDay(item.docValues.orderTakingDate) && item.docStatus == DocSTATUS.OPEN)
                                            })}    
                                        >
                                            <td className={cn(className, {
                                                    [styles.deleted]: item.docStatus == DocSTATUS.DELETED 
                                                },
                                                {
                                                    [styles.proveden]: item.docStatus == DocSTATUS.PROVEDEN 
                                                },
                                                {
                                                    [styles.open]: item.docStatus == DocSTATUS.OPEN 
                                                },
                                                )}>
                                                {getDocStatus(item.docStatus)}
                                            </td>
                                            <td></td>
                                            <td>{user.name}</td>
                                            <td className={styles.rowDate}>{secondsToDateString(item.date)}</td>
                                            <td className={styles.rowId}>{item.id}</td>
                                            {/* <td></td> */}
                                            <td>{getNameReference(references,item.docValues?.senderId)}</td>
                                            {/* <td>{secondsToDateString(item.docValues.orderTakingDate)}</td> */}
                                            {/* <td>{item.docValues.orderTakingTime}</td> */}
                                            <td>{getNameReference(references,item.docValues?.receiverId)}</td>
                                            <td>{getPhoneReference(references,item.docValues?.receiverId)}</td>
                                            
                                            <td>{getNameReference(references,item.docValues?.analiticId)}</td>
                                            {/* <td>{item.docValues.comment}</td> */}
                                            <td className={cn(styles.rowSumma, styles.tdSumma)}>{numberValue(item.docValues.count)}</td>
                                            <td className={cn(styles.rowSumma, styles.tdSumma)}>{numberValue(item.docValues.price)}</td>
                                            <td className={cn(styles.rowSumma, styles.tdSumma)}>{numberValue(item.docValues.total)}</td>
                                            {/* <td className={cn(styles.rowSumma, styles.tdRed)}>-{numberValue(item.docValues.cashFromPartner)}</td> */}
                                            {/* <td>{item.docValues.orderWithDeleviry ? 'Доставка бор': ''}</td> */}
                                            {/* <td className={styles.rowId}>{item.docValues.orderAdress}</td> */}
                                            {/* <td className={cn(styles.rowSumma, styles.tdSumma)}>{numberValue(item.docValues.total - (item.docValues.cashFromPartner ? item.docValues.cashFromPartner: 0))}</td> */}
                                            
                                        </tr>
                                    )   
                                })
                            }
                        </tbody>
                    </table>
                </div>
            }
            <div className={styles.footer}>
                {dashboardUsers && <Footer windowFor='orders' total={total} count={count} docCount={docCount}/>} 
            </div>
            
        </>
    )
}
