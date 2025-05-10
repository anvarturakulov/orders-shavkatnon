import { NewClientWindowProps } from "./newClientWindow.props";
import styles from './newClientWindow.module.css';
import { Button } from '../button/Button';
import { useState } from 'react';
import { NewClient } from '@/app/interfaces/document.interface';
import { useAppContext } from '@/app/context/app.context';

export const NewClientWindow = ({className, ...props}: NewClientWindowProps): JSX.Element => {
  
  const {mainData, setMainData} = useAppContext();
  const [newClient, setNewClient] = useState<NewClient>({...mainData.window.newClient})

  const saveData = (newClient: NewClient, setMainData: Function | undefined) => {
    const {name, phone} = newClient;
    
    const newInterval = {
      name,
      phone
    }

    if (setMainData) {
      setMainData('newClient', {...newClient})
      setMainData('showNewClientWindow', false);
      setMainData('updateDataForDocumentJournal', false);  
    }
    else {
      alert('Малумотларни киритишда хатолик')
    }
  }

  const closeWindow = (setMainData: Function | undefined) => {
    setMainData && setMainData('showNewClientWindow', false);   
  }
  let {name, phone} = newClient
  
  const changeElements = (e: React.FormEvent<HTMLInputElement>, setInterval: Function , newClient:NewClient) => {
        let target = e.currentTarget;
        let value = target.value;
        let id = target.id;
        let newValues;

        if (id == 'name') {
          newValues = {
            ...newClient,
            name: value
          }
        } else {
          newValues = {
            ...newClient,
            phone: value
          }
        }
        setInterval(newValues)
    }

  return (
      <>
          { mainData.window.showIntervalWindow && 
            <div className={styles.box}>
              <div>Янги мижоз малумотлари</div>
              <input 
                type='text' 
                className={styles.input} 
                id='name' 
                value={name}
                onChange={(e) => changeElements(e, setInterval, newClient)}
              />
              <input 
                type='tel' 
                className={styles.input} 
                id='phone' 
                value={phone}
                placeholder="+9 (9890) 123-45-67"
                pattern="\+?[1-9]\d{1,14}"
                onChange={(e) => changeElements(e, setInterval, newClient)}
              />
              <div className={styles.btnBox}>
                <Button appearance='primary' onClick={() => saveData(newClient, setMainData)}> Саклаш </Button>
                <Button appearance='ghost' onClick={() => closeWindow(setMainData)}> Чикиш </Button>
              </div>
            </div>
          }
      </>
  )
}