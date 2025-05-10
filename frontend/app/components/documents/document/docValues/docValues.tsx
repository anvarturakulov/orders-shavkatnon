import { DocValuesProps } from './docValues.props';
import styles from './docValues.module.css';
import cn from 'classnames';
import { useAppContext } from '@/app/context/app.context';
import { DocumentType, OptionsForDocument } from '@/app/interfaces/document.interface';
import { CheckBoxInTable } from '../inputs/checkBoxInForm/checkBoxInForm';
import { getOptionOfDocumentElements } from '@/app/service/documents/getOptionOfDocumentElements';
import { InputInForm } from '../inputs/inputInForm/inputInForm';
import { SelectReferenceInForm } from '../selects/selectReferenceInForm/selectReferenceInForm';
import { addItems, getDefinedItemIdForReceiver, getDefinedItemIdForSender, getLabelForAnalitic, getTypeReferenceForAnalitic, saveItemId } from './doc.values.functions';
import { TypeReference } from '@/app/interfaces/reference.interface';
import { defaultDocumentTableItem } from '@/app/context/app.context.constants';
import { DocTable } from '../docTable/docTable';
import AddIco from './ico/add.svg'
import { getPriceAndBalance } from '@/app/service/documents/getPriceBalance';
import { UserRoles } from '@/app/interfaces/user.interface';
import { useEffect } from 'react';
import { InputForDate } from '../inputs/inputForDate/inputForDate';
import { InputForTime } from '../inputs/inputForTime/inputForTime';
import { useRef } from 'react';

export const DocValues = ({ className, ...props }: DocValuesProps): JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { contentName, isNewDocument, contentTitle } = mainData.window;
    const { currentDocument} = mainData.document;
    const { user } = mainData.users;
    const role = user?.role;
    const storageIdFromUser = user?.sectionId;
    const firstInputRef = useRef<HTMLInputElement>(null);

    let options: OptionsForDocument = getOptionOfDocumentElements(contentName)

    let definedItemIdForReceiver = getDefinedItemIdForReceiver(role, storageIdFromUser, contentName)
    let definedItemIdForSender = getDefinedItemIdForSender(role, storageIdFromUser, contentName)

    const labelForDate = currentDocument.docValues.orderWithDeleviry ? 'Етказ. бериш санаси' : 'Олиб кетиш санаси'
    const labelForTime = currentDocument.docValues.orderWithDeleviry ? 'Етказ. бериш вакти' : 'Олиб кетиш вакти'

    const orderDateAndTime = (
        <div className={styles.dataBoxForOrder}>
            <InputForDate label={labelForDate} id='orderTakingDate'/>
            <InputForTime label={labelForTime}/>    
        </div>
    )

   
    return (
        <div className={styles.container}>
            { 
                orderDateAndTime
            }

            {
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
            }

            <div className={styles.partnersBox}>
                <SelectReferenceInForm 
                    label={'Мижоз'} 
                    typeReference={options.receiverType}
                    visibile={true}
                    currentItemId={currentDocument?.docValues.receiverId}
                    type='receiver'
                    definedItemId= {definedItemIdForReceiver}
                />

                <SelectReferenceInForm 
                    label={'Цех'} 
                    typeReference={options.senderType}
                    visibile={true}
                    currentItemId={currentDocument?.docValues.senderId}
                    type='sender'
                    definedItemId= {definedItemIdForSender}
                />
                
            </div>

            <div className={cn(styles.valuesBox)}>
                
                <SelectReferenceInForm 
                    label={'Махсулот'} 
                    typeReference= {TypeReference.TMZ}
                    visibile={true}
                    currentItemId={currentDocument?.docValues.analiticId}
                    type='analitic'
                />

                <InputInForm 
                    nameControl='count' 
                    type='number' 
                    label='Сон' 
                    visible={options.countIsVisible} 
                    />
                
                {
                    !options.tableIsVisible &&
                    <>
                        <InputInForm 
                            nameControl='price' 
                            type='number' 
                            label='Нарх' 
                            visible={options.priceIsVisible} 
                            isNewDocument
                            disabled ={options.priceIsDisabled}
                            />
                        <InputInForm 
                            nameControl='total' 
                            type='number' 
                            label={contentName == DocumentType.SaleProd? 'Махсулот суммаси':'Сумма'} 
                            visible={options.totalIsVisible}
                            disabled={options.totalIsDisabled}
                            />
                        
                        <InputInForm 
                            nameControl='cashFromPartner' 
                            type='number' 
                            label={'Аванс'} 
                            visible={true}
                            disabled={false}
                            />

                        <InputInForm nameControl='comment' type='text' label='Изох' visible={true}/>

                    </>
                }

                

            </div>
        </div>
    )
}


