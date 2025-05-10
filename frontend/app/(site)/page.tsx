'use client'
import styles from './page.module.css';
import { useAppContext } from '@/app/context/app.context';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { Spinner } from '../components/common/spinner/spinner';
import Tabs from '../components/tabs/tabs';

export default function MainPage() {

  const {mainData, setMainData} = useAppContext()
  const { contentType, mainPage } = mainData.window
  const { user } = mainData.users
  const token = user?.token;

  const [showMainPage, setShowMainPage] = useState<boolean>(true)

  let url = process.env.NEXT_PUBLIC_DOMAIN+'/api/users/names/';
  const { data : usersName, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
  
  useEffect(() => {
    if (user) {
      setShowMainPage(true);
    }
  }, [user, setShowMainPage]);

  if (!showMainPage) return (
    <Spinner/>
  )

  return (
    <div className={styles.container}>
      <Tabs/>
    </div>
  )
}
