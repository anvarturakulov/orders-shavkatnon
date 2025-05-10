import { useState } from 'react';
import Image from 'next/image';
import styles from './tabs.module.css';
import Order from '../order/order';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber:number) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabList}>
        <button
          className={`${styles.tab} ${activeTab === 1 ? styles.active : ''}`}
          onClick={() => handleTabClick(1)}
        >
          Янги
        </button>
        <button
          className={`${styles.tab} ${activeTab === 2 ? styles.active : ''}`}
          onClick={() => handleTabClick(2)}
        >
          Руйхат
        </button>
        <button
          className={`${styles.tab} ${activeTab === 3 ? styles.active : ''}`}
          onClick={() => handleTabClick(3)}
        >
          Архив
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
      </div>
    </div>
  );
}