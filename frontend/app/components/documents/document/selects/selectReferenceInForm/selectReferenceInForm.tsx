import { SelectReferenceInFormProps, TypeForSelectInForm } from './selectReferenceInForm.props';
import styles from './selectReferenceInForm.module.css';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import cn from 'classnames';
import { ReferenceModel, TypeReference, } from '@/app/interfaces/reference.interface';
import { Maindata } from '@/app/context/app.context.interfaces';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { sortByName } from '@/app/service/references/sortByName';
import { useEffect, useState } from 'react';
import { sender } from './query/sender';

export const SelectReferenceInForm = ({ label, typeReference, visibile=true , definedItemId ,currentItemId, type, maydaSavdo, className, ...props }: SelectReferenceInFormProps): JSX.Element => {
    const {mainData, setMainData} = useAppContext();
    const { user } = mainData.users;
    const token = user?.token;
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/references/byType/'+typeReference;
    const { data } = useSWR(url, (url) => getDataForSwr(url, token));

    const [selected, setSelected] = useState('');
        
    useEffect(()=> {
        if (data && data.length>0) {
            const initialValue = data[data.findIndex((elem: ReferenceModel) => 
                (
                    elem?.id == definedItemId || 
                    elem?.id == currentItemId 
                ))]?.name || 'NotSelected'
            setSelected(initialValue)
        }
    }, [data, currentItemId, definedItemId])

    const changeElements = (e: React.FormEvent<HTMLSelectElement>, setMainData: Function | undefined, mainData: Maindata, type: TypeForSelectInForm, maydaSavdo: boolean | undefined) => {
        
        const { user } = mainData.users;
        const {  currentDocument } = mainData.document;
        
        if (currentDocument) {
            let target = e.currentTarget;
            let currentItem = {...currentDocument};
            let idStr = target[target.selectedIndex].getAttribute('data-id');
            let id:number = 0
            if (idStr) id = +idStr

            if (type == 'sender' && id) {
                currentItem.docValues.senderId = id
            }
              
            if (type == 'analitic' && id) {
                currentItem.docValues.analiticId = id
            }
            if ( setMainData ) {
                setMainData('currentDocument', {...currentItem})
            }
        }
        
    }
    
    if (!visibile) return <></>

    let flagDisabled = Boolean(definedItemId)

    return (
        <div className={styles.box}>
            {label !='' && <div className={styles.label}>{label}</div>}
            <select
                className={cn(styles.select)}
                {...props}
                onChange={(e) => changeElements(e, setMainData, mainData, type, maydaSavdo)}
                disabled = { flagDisabled }
                value={selected}
            >   
                    <option 
                        value={'NotSelected'} 
                        data-type={null} 
                        data-id={null}
                        className={styles.chooseMe}
                        key= {-1}
                        >{'=>'}
                    </option>
                {data && data.length>0  &&
                data
                .filter((item:ReferenceModel) => {
                    if (typeReference == TypeReference.TMZ) {
                        return item.refValues?.typeTMZ == 'PRODUCT'
                    } else return true
                })
                
                .filter((item: ReferenceModel) => {
                    return (
                        sender(item, type)
                    )
                })
                
                .sort(sortByName)
                .filter(( item:ReferenceModel ) => !item.refValues?.markToDeleted )
                .map(( item:ReferenceModel ) => (
                    <option 
                        className={styles.option}
                        key = {item.id}
                        value={item.name}
                        data-type={item.typeReference} 
                        data-id={item.id}>
                            {item.name}
                    </option>  
                ))}
            </select>
        </div>
    );
};
