import {Suspense} from 'react'
import {Outlet} from 'react-router-dom'
import {LayoutProvider, LayoutSplashScreen} from '@/layout/core'
import {MasterInit} from '@/layout/MasterInit'
import {AuthInit} from '@/pages/auth'

const App = () => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
        <LayoutProvider>
          <AuthInit>
            <Outlet />
            <MasterInit />
          </AuthInit>
        </LayoutProvider>
    </Suspense>
  )
}

export {App}
