'use client'
import Image from 'next/image';
import styles from './page.module.css';
import { useAppContext } from '@/app/context/app.context';
import { Message } from '@/app/components/common/message/message';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Tabs from '@/app/components/tabs/tabs';

export default function Dashboard() {

  const {mainData, setMainData} = useAppContext()
  const { contentType, mainPage } = mainData.window
  const { user } = mainData.users

  useEffect(() => {
    if (user == undefined) {
      redirect('/');
    }
  }, [user]);

  return (
    <>
      <div className={styles.container}>
        <Tabs />
      </div>
      <Message />
    </>
  )
}
