import { useState } from 'react';
import Image from 'next/image';
import styles from './tabs.module.css';
import Order from '../order/order';
import { useAppContext } from '@/app/context/app.context';
import { DocumentType } from '@/app/interfaces/document.interface';
import OrderJournal from '../journals/orderJournal/orderJournal';
import OrderMiniJournal from '../journals/orderMiniJournal/orderMiniJournal';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState(1);
  const { mainData, setMainData } = useAppContext();
  const { user } = mainData.users;

  const handleTabClick = (tabNumber:number) => {

    if (setMainData) {
      if (tabNumber < 4) setMainData('isNewDocument', true) 
      else setMainData('isNewDocument', false);
    
      if (tabNumber == 4 ) setMainData('contentName', DocumentType.Order)
    }

     
    setActiveTab(tabNumber);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabList}>
        <button
          className={`${styles.tab} ${activeTab === 1 ? styles.active : ''}`}
          onClick={() => handleTabClick(1)}
        >
          Заказ
        </button>
        <button
          className={`${styles.tab} ${activeTab === 2 ? styles.active : ''}`}
          onClick={() => handleTabClick(2)}
        >
          Заклад
        </button>
        <button
          className={`${styles.tab} ${activeTab === 3 ? styles.active : ''}`}
          onClick={() => handleTabClick(3)}
        >
          Жунатиш
        </button>
        <button
          className={`${styles.tab} ${activeTab === 4 ? styles.active : ''}`}
          onClick={() => handleTabClick(4)}
        >
          Руйхат
        </button>
        <button
          className={`${styles.tab} ${activeTab === 5 ? styles.active : ''}`}
          onClick={() => handleTabClick(5)}
        >
          Руйхат
        </button>
        <button
          className={`${styles.tab} ${activeTab === 6 ? styles.active : ''}`}
          onClick={() => handleTabClick(6)}
        >
          Руйхат
        </button>
      </div>

      <div className={styles.tabListBottom}>
        <button
          className={`${styles.tab} ${activeTab === 7 ? styles.active : ''}`}
          onClick={() => handleTabClick(7)}
        >
          Ким канча карз
        </button>
      </div>

      {/* Контент вкладок */}
      <div className={styles.tabContent}>
        {activeTab === 1 && (
          <Order/>
        )}
        {activeTab === 2 && (
          <div className={styles.content}>
            <h2>Контент Вкладки 2</h2>
            <p>Это текст для второй вкладки.</p>
          </div>
        )}
        {activeTab === 3 && (
          <div className={styles.content}>
            <h2>Контент Вкладки 3</h2>
            <p>Это текст для третьей вкладки.</p>
          </div>
        )}
        {activeTab === 4 && (
          <div className={styles.content}>
            <OrderMiniJournal/>
          </div>
        )}
        {activeTab === 5 && (
          <div className={styles.content}>
            <h2>Контент Вкладки 5</h2>
            <p>Это текст для пятой вкладки.</p>
          </div>
        )}
        {activeTab === 6 && (
          <div className={styles.content}>
            <h2>Контент Вкладки 6</h2>
            <p>Это текст для шестой вкладки.</p>
          </div>
        )}
        {activeTab === 7 && (
          <div className={styles.content}>
            <h2>Контент Вкладки 7</h2>
            <p>Это текст для седмой вкладки.</p>
          </div>
        )}
      </div>
    </div>
  );
}