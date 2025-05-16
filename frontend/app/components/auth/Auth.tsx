'use client'
import { useEffect, useState } from 'react'
import styles from './Auth.module.css'
import { redirect } from 'next/navigation'
import { useAppContext } from '@/app/context/app.context'
import { Htag } from '../common/htag/Htag'
import { Input } from '../common/input/input'
import { Message } from '../common/message/message'
import { loginToApp } from '@/app/service/common/loginToApp'
import { showMessage } from '@/app/service/common/showMessage'
import ReCAPTCHA from 'react-google-recaptcha'
import { setTodayToInterval } from '@/app/service/reports/setTodayToInterval'
import { BodyForLogin, dashboardUsersList, workersUsersList } from '@/app/interfaces/user.interface'
import useSWR from 'swr'
import { getDataForSwr } from '@/app/service/common/getDataForSwr'
import Image from 'next/image';
import Script from 'next/script';

const defaultBody: BodyForLogin = {
  email: '',
  password: ''
}

export default function Auth() {
  
  const {mainData, setMainData} = useAppContext();
  const { user } = mainData.users
  const [capVal, setCapVal] = useState<boolean>(true);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
 
  const onSubmit = (setMainData: Function | undefined) => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        const data = tg.initData;
        if (1) {
          // const body = { initData: data };
          const body = {initData: 'query_id=AAFmBTMyAAAAAGYFMzJrQq9E&user=%7B%22id%22%3A842204518%2C%22first_name%22%3A%22Anvar%22%2C%22last_name%22%3A%22Turakulov%22%2C%22username%22%3A%22AnvarTurakulov%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fi6_aXS123tuPLsylAdbFLC3WGMTg80JEnJJR_5de_Cw.svg%22%7D&auth_date=1747223696&signature=45VMXFp2uBVNNoHW5dDWGAU0EjPp0V8wCrDRjD9apaCQcL6B9UncjrB8h43Io5ytnyl39HejsQZNYUFacY7RDg&hash=91cf79ce8b7a19a37983224433d648d3dc39a5ecc3b14eb809fa90931fca43e8'}
          loginToApp(body, setMainData )
        } else {
          console.warn('initData is empty');
        }
      } else {
        console.error('Telegram WebApp SDK not loaded or not in Telegram context');
        // setIsWebAppReady(false);
      }
  }
  
  useEffect(() => {
    const {user} = mainData.users
    if (user != undefined) {
      if (dashboardUsersList.includes(user?.role)) {
        redirect('/dashboard')
      } else {
        redirect('/')
      }
    }

  }, [user, mainData.users])

  const changeVal = () => {
    setCapVal(val => !val)
  }

  useEffect(()=> {
    setTodayToInterval(setMainData);
  }, [])

  const btnIsDisabled = (!isSdkLoaded) ? true : false
  return (
    <>
      <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <Image
              src="/one.jpg"
              alt="Loading"
              width={300} 
              height={300}
              priority = {false}
              quality={50} 
              className={styles.img}
            />
          </div>
          <div className={styles.btnBox}>
            <button 
                // disabled={btnIsDisabled}
                className={styles.button} 
                onClick={() => onSubmit(setMainData)}>
                Кириш
            </button>
          </div>
      </div>
      <Message/>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Telegram WebApp SDK loaded');
          setIsSdkLoaded(true);
        }}
        onError={(e) => {
          console.error('Failed to load Telegram WebApp SDK:', e);
          setIsSdkLoaded(false);
        }}
      />
    </>
      
  )
}
