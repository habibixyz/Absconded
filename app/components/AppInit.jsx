'use client'

import { useEffect } from 'react'
import { App } from '@capacitor/app'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { Capacitor } from '@capacitor/core'

export default function AppInit() {
  useEffect(() => {
    // Focus window immediately on load so scrolling works without needing an initial click
    if (typeof window !== 'undefined') {
      try {
        window.focus()
      } catch (e) {}
    }

    if (!Capacitor.isNativePlatform()) return

    // Hide splash screen & configure mobile status bar
    const init = async () => {
      try {
        await SplashScreen.hide()
        await StatusBar.setStyle({ style: Style.Dark })
        if (Capacitor.getPlatform() === 'android') {
          await StatusBar.setBackgroundColor({ color: '#050505' })
        }
      } catch (e) {
        console.warn('Capacitor native initialization notice:', e)
      }
    }

    init()

    // Smart hierarchical Android hardware back button handler
    const backHandlerPromise = App.addListener('backButton', ({ canGoBack }) => {
      // 1. If any drawer, modal or search overlay is open, close it first
      const closeTarget = document.querySelector('[data-back-close="true"]') ||
                          document.querySelector('button[aria-label="Close"]') ||
                          document.querySelector('[data-drawer-open="true"] [data-drawer-close]')
      if (closeTarget) {
        closeTarget.click()
        return
      }

      // 2. Otherwise navigate back or exit cleanly
      if (canGoBack) {
        window.history.back()
      } else {
        App.exitApp()
      }
    })

    return () => {
      backHandlerPromise.then(h => h.remove()).catch(() => {})
    }
  }, [])

  return null
}

