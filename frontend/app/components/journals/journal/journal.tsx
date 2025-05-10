'use client'
import styles from './journal.module.css'
import IcoTrash from './ico/trash.svg'
import IcoSave from './ico/save.svg'
import {JournalProps} from './journal.props'
import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import cn from 'classnames';
import Header from '../../common/header/header';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { cleanDocs, deleteItemDocument, getDocument, getNameReference, getUserName, isDirector, isFounder, setProvodkaToDoc, showDatesDuplicateWindow } from '../helpers/journal.functions';
import { getDescriptionDocument } from '@/app/service/documents/getDescriptionDocument';
import { DocSTATUS, DocumentModel, DocumentType, Interval } from '@/app/interfaces/document.interface';
import { dateNumberToString } from '@/app/service/common/converterForDates'
import Footer from '../../common/footer/footer'
import { numberValue } from '@/app/service/common/converters'
import { CheckBoxInFooter } from '../helpers/checkBoxInFooter/checkBoxInFooter'
import { dashboardUsersList, UserRoles } from '@/app/interfaces/user.interface'
import { Doc } from '../../documents/document/doc/doc'
import { secondsToDateString } from '../../documents/document/doc/helpers/doc.functions'
import { Button } from '../../common/button/Button'
import { duplicateDocsForDate } from '@/app/service/documents/duplicateDocsForDate'


interface FilterForJournal {
    summa: string,
    receiver: string,
    sender: string,
    analitic: string,
    comment: string,
    user: string
}
    
const defaultFilter: FilterForJournal = {
    summa: 'Сумма',
    receiver: 'Олувчи',
    sender: 'Берувчи',
    analitic: 'Аналитика',
    comment: 'Изох',
    user: 'Фойдаланувчи'
}

const documentTotal = (item: DocumentModel) => {
    if (
        (item.documentType == DocumentType.LeaveMaterial ||
        item.documentType == DocumentType.ComeHalfstuff) &&
        item.docTableItems?.length 
    ) return numberValue(item.docTableItems.reduce((summa, item) => summa + item.total,0))

    return numberValue(item.docValues?.total)
}

const totals = (item: DocumentModel) => {
    let total = item.docValues?.total;
    let count = item.docValues?.count;

    if (( item.documentType == DocumentType.LeaveMaterial ||  item.documentType == DocumentType.ComeHalfstuff) 
        && item.docTableItems?.length ) {
        let t = item.docTableItems.reduce((summa, item) => summa + item.total,0)
        let c = item.docTableItems.reduce((count, item) => count + item.count,0)
        total = t;
        count = c;
    }

    return {t: total, c:count}
}

export default function Journal({ className, ...props}:JournalProps):JSX.Element {
    
    const {mainData, setMainData} = useAppContext();
    const {dateStart, dateEnd} = mainData.window.interval;
    const { journalChechboxs, updateDataForDocumentJournal } = mainData.journal;

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
    const { showDocumentWindow, contentName, goRequestByDuplicateDocs } = mainData.window;
    const role = user?.role;
    const dashboardUsers = role && dashboardUsersList.includes(role);

    const token = user?.token;
    let url = process.env.NEXT_PUBLIC_DOMAIN+'/api/documents/byTypeForDate'+'?documentType='+contentName+'&dateStart='+dateStartForUrl+'&dateEnd='+dateEndForUrl;
    
    if (!contentName) {
        let url = process.env.NEXT_PUBLIC_DOMAIN+'/api/documents/all/';
    }

    const urlReferences = process.env.NEXT_PUBLIC_DOMAIN+'/api/references/all/';

    const { data : documents, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    const { data : references, mutate: mutateReferences } = useSWR(urlReferences, (urlReferences) => getDataForSwr(urlReferences, token));

    
    useEffect(() => {
        mutate()
        mutateReferences()
        setMainData && setMainData('updateDataForDocumentJournal', false);
    }, [showDocumentWindow, updateDataForDocumentJournal])

    useEffect(() => {
        const {dateFrom, dateTo} = mainData.window.datesForDuplicateDocs
        if (goRequestByDuplicateDocs && dateFrom && dateTo ) {
            console.log('ready to go request')
            duplicateDocsForDate(dateFrom, dateTo, mainData, setMainData)

        }
    }, [goRequestByDuplicateDocs])

    const changeFilter = (target: string) => {
        let title: string = '';
        let defaulValue: string = '';
        if (target == 'summa') {
            title = 'Хужжат суммаси ?';
            defaulValue = 'Сумма';
        }
        if (target == 'receiver') {
            title = 'Олувчи ?';
            defaulValue = 'Олувчи';
        }
        if (target == 'sender') {
            title = 'Берувчи ?';
            defaulValue = 'Берувчи';
        }

        if (target == 'analitic') {
            title = 'Аналитика ?';
            defaulValue = 'Аналитика';
        }

        if (target == 'comment') {
            title = 'Изох ?'; 
            defaulValue = 'Изох';
        }
        if (target == 'user') {
            title = 'Фойдаланувчи ?';
            defaulValue = 'Фойдаланувчи';
        }
        
        let currentValue = prompt(title);
        
        if (!currentValue) currentValue = defaulValue
        
        if (currentValue != null) {
            setFilter(filter => {
                let newObj = {...filter}
                return {
                    ...newObj,
                    [target] : currentValue
                }
            })
        }
        
    }   

    let count:number = 0;
    let total: number = 0;
    let docCount: number = 0;

    const filteredDocuments = useMemo(() => {
        if (documents && !Array.isArray(documents)) {
            console.error('documents is not an array:', documents);
            return []; // Возвращаем пустой массив в случае ошибки
        }
        return (
            documents &&
            documents
                .sort((a: DocumentModel, b: DocumentModel) => {
                    const dateComparison = a.date - b.date;
                    if (dateComparison === 0 && a.id && b.id) {
                        return a.id - b.id;
                    }
                    return dateComparison;
                })
                .filter((item: DocumentModel) => {
                    const { summa, receiver, sender, comment, user, analitic } = filter;
                    const userLowerCase = user.toLowerCase();
                    const userName = `${getUserName(item.userId, mainData)}`.toLowerCase();
                    const analiticName = getNameReference(references, item.docValues?.analiticId);
                    const productName = getNameReference(references, item.docValues?.productForChargeId);
                    const itemComment = item.docValues?.comment;
                    const bigString = `${productName}${itemComment}`.toLowerCase();
                    const commentInLowerCase = comment.toLowerCase();
                    const itemSender = getNameReference(references, item.docValues?.senderId);
                    const itemReceiver = getNameReference(references, item.docValues?.receiverId);
    
                    if (journalChechboxs.charges && (item.docValues?.isWorker || item.docValues?.isPartner)) return false;
                    if (journalChechboxs.workers && !item.docValues?.isWorker) return false;
                    if (journalChechboxs.partners && !item.docValues?.isPartner) return false;
                    if (user !== 'Фойдаланувчи' && !userName.includes(userLowerCase)) return false;
                    if (comment !== 'Изох' && !bigString.includes(commentInLowerCase)) return false;
                    if (sender !== 'Берувчи' && !(itemSender && itemSender.toLowerCase().includes(sender.toLowerCase()))) return false;
                    if (receiver !== 'Олувчи' && !(itemReceiver && itemReceiver.toLowerCase().includes(receiver.toLowerCase()))) return false;
                    if (analitic !== 'Аналитика' && !(analiticName && analiticName.toLowerCase().includes(analitic.toLowerCase()))) return false;
                    
                    if (summa !== 'Сумма' && item.docValues?.total !== +summa) return false;
                    if (role !== UserRoles.ADMIN && role !== UserRoles.HEADCOMPANY) {
                        if (isDirector(references, item.docValues?.senderId)) return false;
                        if (isFounder(references, item.docValues?.senderId) || isFounder(references, item.docValues?.receiverId)) return false;
                    }
                    return true;
                })
        );
    }, [documents, filter, journalChechboxs, references, mainData, role]);

    return (
        <>
            {dashboardUsers && <Header windowFor='document' total={total} count={count}/>}  
            <>
                <div className={styles.newElement}>
                    {showDocumentWindow && <Doc/>}
                </div>
            </>
            
            {
                dashboardUsers && 
                <div className={styles.container} >
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr key='-1'>
                                <th key='1' className={styles.rowId}>Раками </th>
                                <th key='2' className={styles.rowDate}>Сана</th>
                                <th key='4'>Хужжат тури</th>
                                <th key='5' 
                                    onDoubleClick={() => changeFilter('summa')} 
                                    className={cn(styles.rowSumma, {
                                        [styles.red]: filter.summa != 'Сумма'
                                    })}
                                    >{filter.summa}
                                </th>
                                <th key='6' 
                                    onDoubleClick={() => changeFilter('receiver')}
                                    className={cn(styles.longRow, {
                                        [styles.red]: filter.receiver != 'Олувчи'
                                    })}    
                                    >{filter.receiver}
                                </th>
                                <th key='7' 
                                    onDoubleClick={() => changeFilter('sender')}
                                    className={cn(styles.longRow, {
                                        [styles.red]: filter.sender != 'Берувчи'
                                    })}
                                    >{filter.sender}
                                </th>
                                <th key='8' 
                                    onDoubleClick={() => changeFilter('analitic')}
                                    className={cn(styles.longRow, {
                                        [styles.red]: filter.analitic != 'Аналитика'
                                    })}
                                    >{filter.analitic}
                                </th>
                                <th key='9' 
                                    onDoubleClick={() => changeFilter('comment')}
                                    className={cn(styles.longRow, {
                                        [styles.red]: filter.comment != 'Изох'
                                    })}
                                >{filter.comment}</th>
                                <th key='10' 
                                    onDoubleClick={() => changeFilter('user')}
                                    className={cn(styles.longRow, {
                                        [styles.red]: filter.user != 'Фойдаланувчи'
                                    })}
                                    >{filter.user}
                                </th>
                                <th key='11' className={styles.rowAction}>Амал</th>
                                <th key='12' className={styles.rowAction}>Амал</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {filteredDocuments && 
                                filteredDocuments.map((item:DocumentModel, key: number) => {
                                    let {t, c} = totals(item)
                                    total += item.docStatus != DocSTATUS.DELETED ? t : 0;
                                    count += item.docStatus != DocSTATUS.DELETED ? c : 0;
                                    docCount += item.docStatus != DocSTATUS.DELETED ? 1 : 0;
                                    const productForChargeName = getNameReference(references,item.docValues?.productForChargeId)
                                    return (
                                        <tr 
                                            key={key} 
                                            className={cn(className)}
                                            onDoubleClick={() => {getDocument(item.id, setMainData, token)}}    
                                        >
                                            <td className={styles.rowId}>{item.id}</td>
                                            <td className={styles.rowDate}>{secondsToDateString(item.date)}</td>
                                            <td className={cn(styles.documentType, {
                                                [styles.proveden]: item.docStatus == DocSTATUS.PROVEDEN,
                                                [styles.deleted]: item.docStatus == DocSTATUS.DELETED
                                                })}>
                                                    {getDescriptionDocument(item.documentType)}
                                            </td>
                                            <td className={cn(styles.rowSumma, styles.tdSumma)}>{documentTotal(item)}</td>
                                            <td>{getNameReference(references,item.docValues?.receiverId)}</td>
                                            <td>{getNameReference(references,item.docValues?.senderId)}</td>
                                            <td>{getNameReference(references,item.docValues?.analiticId)}</td>
                                            <td>{`${productForChargeName ? `${productForChargeName} - `: ''}${item.docValues?.comment ? `${item.docValues?.comment} - `: ''} ${item.docValues?.count ? `${item.docValues?.count}`: ''}`}</td>
                                            <td>{getUserName(item.userId, mainData)}</td>
                                            <td className={styles.rowAction}>
                                                <IcoTrash className={styles.icoTrash}
                                                onClick = {() => deleteItemDocument(item.id, item.date, token, setMainData, mainData)}
                                                />
                                            </td>
                                            <td className={styles.rowAction}>
                                                <IcoSave className={styles.icoSave}
                                                onClick = {() => setProvodkaToDoc(item.id, token ,item.docStatus ,setMainData, mainData, item.docValues?.receiverId, item.docValues?.senderId)}
                                                />
                                            </td>
                                        </tr>
                                    )   
                                })
                            }
                        </tbody>
                    </table>
                </div>
            }
            <div className={styles.footer}>
                {dashboardUsers && <Footer windowFor='document' total={total} count={count} docCount={docCount}/>} 
            {
                contentName == DocumentType.LeaveCash &&
                <div className={styles.checkboxs}>
                    <CheckBoxInFooter id='charges' label='Харажат'/>
                    <CheckBoxInFooter id='workers' label='Иш хаки'/>
                    <CheckBoxInFooter id='partners' label='Таъминотчи'/>
                </div>
                
            }

            {
                contentName == DocumentType.ComeProduct &&
                <Button appearance='ghost'className={styles.button} onClick={()=>cleanDocs(dateStartForUrl, dateEndForUrl, token, setMainData)}>Бугунги киримларни тозалаш</Button>
            }

            {
                contentName == DocumentType.ZpCalculate &&
                <Button appearance='ghost'className={styles.button} onClick={()=>showDatesDuplicateWindow(setMainData)}>Утган кундан андоза олиш</Button>
            }
            </div>
            
            
        </>
    )
}
