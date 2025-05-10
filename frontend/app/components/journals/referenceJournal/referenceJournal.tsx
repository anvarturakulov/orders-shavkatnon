'use client'
import styles from './referenceJournal.module.css'
import cn from 'classnames';
import IcoTrash from './ico/trash.svg'
import { useEffect } from 'react';
import { Reference } from '../../reference/reference';
import { ReferenceModel } from '../../../interfaces/reference.interface';
import useSWR from 'swr';
import { ReferenceJournalProps } from './referenceJournal.props';
import { useAppContext } from '@/app/context/app.context';
import Header from '../../common/header/header';
import { getTypeReference } from '@/app/service/references/getTypeReference';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { getReference, markToDelete } from './helpers/reference.functions';
import { getNameReference } from '../helpers/journal.functions';
import { sortByName } from '@/app/service/references/sortByName';

export default function ReferenceJournal({className, ...props}:ReferenceJournalProps):JSX.Element {
    
    const {mainData, setMainData} = useAppContext();
    const { contentName, showReferenceWindow } = mainData.window;
    const { user } = mainData.users;
    const { updateDataForRefenceJournal } = mainData.journal
    const referenceType = getTypeReference(contentName);
    const token = user?.token;
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/references/byType/'+referenceType;
    const urlReferences = process.env.NEXT_PUBLIC_DOMAIN+'/api/references/all/';

    const { data, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    const { data : references, mutate: mutateReferences } = useSWR(urlReferences, (urlReferences) => getDataForSwr(urlReferences, token));

    useEffect(() => {
        mutate()
        setMainData && setMainData('updateDataForRefenceJournal', false);
    }, [showReferenceWindow, updateDataForRefenceJournal])

    return (
        <>  
            <Header windowFor='reference' />
            <div className={styles.newElement}>
                <Reference/>
            </div>
            <div className={styles.container} >
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr key = {-1}>
                            <th className={styles.rowId}>№</th>
                            <th className={styles.name}>Номи</th>
                            {
                                referenceType == 'TMZ' &&
                                <>
                                    <th className={styles.types}>Ул. бир.</th>
                                    <th className={styles.types}>ТМБ тури</th>
                                </>
                            }
                            {
                                referenceType == 'PARTNERS' &&
                                <>
                                    <th className={styles.types}>Хамкор тури</th>
                                    <th className={styles.types}>Сохиби</th>
                                </>
                            }
                            <th className={styles.comment}>Изох</th>
                            <th className={styles.rowAction}>Амал</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        {data && 
                        data.length>0 && 
                        data
                        .sort(sortByName)
                        .map((item:ReferenceModel, key:number) => {
                            return (
                            <tr 
                                key={item.id} 
                                onDoubleClick={() => {getReference(item.id, setMainData, token)}} 
                                className={cn(className, {
                                        [styles.deleted]: item.refValues?.markToDeleted,
                                        [styles.trRow]: 1,
                                    })}   
                            >
                                <td className={styles.rowId}>{item.id}</td>
                                <td className={cn(className, {
                                        [styles.name]: 1,
                                    })}
                                >{item.name}</td>
                                {
                                    referenceType == 'TMZ' &&
                                    <>
                                        <td className={styles.types}>{item.refValues?.unit}</td>
                                        <td className={styles.types}>{item.refValues?.typeTMZ}</td>
                                    </>
                                }
                                {
                                    referenceType == 'PARTNERS' &&
                                    <>
                                        <td className={styles.types}>{item.refValues?.typePartners}</td>
                                            <td className={styles.types}>{getNameReference(references,item.refValues?.clientForSectionId)}</td>
                                    </>
                                }
                                <td className={styles.comment}>{item.refValues?.comment}</td>
                                <td className={styles.rowAction}>
                                    <IcoTrash 
                                        className={cn(className,styles.icoTrash, {
                                            [styles.deleted]: item.refValues?.markToDeleted,
                                        })}  
                                        onClick = {() => markToDelete(item.id, item.name, token, setMainData)}
                                        />
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </>
    )
}
