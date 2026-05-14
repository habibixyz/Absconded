'use client'

import { useEffect } from 'react'
import { App } from '@capacitor/app'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'

export default function AppInit() {
  useEffect(() => {
    // Hide splash screen when app is ready
    const init = async () => {
      try {
        await SplashScreen.hide()
        await StatusBar.setStyle({ style: Style.Dark })
        await StatusBar.setBackgroundColor({ color: '#0c0c0c' })
      } catch (e) {
        console.warn('Capacitor plugins not available', e)
      }
    }

    init()

    // Handle Android Back Button
    const backHandler = App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp()
      } else {
        window.history.back()
      }
    })

    return () => {
      backHandler.then(h => h.remove())
    }
  }, [])

  return null
}
