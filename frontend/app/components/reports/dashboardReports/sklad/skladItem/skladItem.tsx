'use client'
import { SkladItemProps } from './skladItem.props';
import styles from './skladItem.module.css';
import { Htag } from '@/app/components';
import { numberValue } from '@/app/service/common/converters';

export const SkladItem = ({className, item, ...props }: SkladItemProps) :JSX.Element => {
    
    // if (currentId) {
    //     listSecondSubconts = getListSecondSubconts(mainData.reportOption.entrys, [Schet.S10, Schet.S21, Schet.S28], currentId);
    // }
    
    return (
       <>
          <div className={styles.item}>
            <Htag tag='h1'>{item?.section}</Htag>
            <Htag tag='h2' className={styles.h2}>Сон буйича</Htag>
            {
                item?.items &&
                item?.items.length &&
                item?.items.map((element:any, key:number) => {
                    const value = element?.value
                    const price = element?.price
                    const valueSum = element?.valueSum
                    const bag = element?.bag

                    if (value == 0) return <></>
                    return (
                        <div className={styles.row} key={key}>
                            <div className={styles.title}>{element?.name}</div>
                            <div className={styles.value}>{numberValue(+value)}</div>
                            <div className={styles.value}><span>{bag ? `(${bag})`: ''}</span></div>
                            <div className={styles.value}>{numberValue(+price)}</div>
                            <div className={styles.value}>{numberValue(+valueSum)}</div>
                        </div>
                    )
                })
            }
            
            {
                item?.items &&
                item?.items.length &&
                <div className={styles.row} key={900}>
                    <div className={styles.totalTitle}>Жами</div>
                    <div className={styles.value}></div>
                    <div className={styles.value}></div>
                    <div className={styles.value}></div>
                    <div className={styles.total}>{
                        numberValue(item?.items.reduce((acc:any, item:any) => {
                            return acc + (item.valueSum || 0)}, 0))
                        }
                    </div>
                </div>
                    
                
            }
            
            
          </div>
      </>
    )
} 