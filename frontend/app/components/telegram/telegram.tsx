'use client';
import { useAppContext } from '@/app/context/app.context';
import { loginToApp } from '@/app/service/common/loginToApp';
import Script from 'next/script';
import React, { useEffect, useState } from 'react';

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      is_premium?: boolean;
      allows_write_to_pm?: boolean;
    };
    auth_date?: number;
    hash?: string;
    [key: string]: any;
  };
  ready: () => void;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

export const TelegramContext = React.createContext<{
  isSdkLoaded: boolean;
  isWebAppReady: boolean;
  initData: string | null;
}>({ isSdkLoaded: false, isWebAppReady: false, initData: null });

export default function TelegramScript({ children }: { children: React.ReactNode }) {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [isWebAppReady, setIsWebAppReady] = useState(false);
  const [initData, setInitData] = useState<string | null>(null);
  // const { setMainData } = useAppContext();

  // async function verifyInitData(initData: string, setMainData: Function | undefined) {
  //   const body = { initData };
  //   console.log('verifyInitData sending:', body);
  //   loginToApp(body, setMainData);
  // }

  // useEffect(() => {
  //   if (isSdkLoaded) {
  //     console.log('Checking Telegram WebApp...');
  //     if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
  //       const tg = window.Telegram.WebApp;
  //       tg.ready();
  //       const data = tg.initData;
  //       console.log('initData:', data);
  //       setInitData(data);
  //       setIsWebAppReady(true);
  //       if (data) {
  //         verifyInitData(data, setMainData);
  //       } else {
  //         console.warn('initData is empty');
  //       }
  //     } else {
  //       console.error('Telegram WebApp SDK not loaded or not in Telegram context');
  //       setIsWebAppReady(false);
  //     }
  //   }
  // }, [isSdkLoaded, setMainData]);

  return (
    <TelegramContext.Provider value={{ isSdkLoaded, isWebAppReady, initData }}>
      {children}
      {/* <Script
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
      /> */}
    </TelegramContext.Provider>
  );
}