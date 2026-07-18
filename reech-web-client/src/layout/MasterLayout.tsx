import {useEffect} from 'react'
import {Outlet, useLocation} from 'react-router-dom'
import {Content} from '@/layout/components/content'
import {ScrollTop} from '@/layout/components/scroll-top'
import {FooterWrapper} from '@/layout/components/footer'
import {HeaderWrapper} from '@/layout/components/header'
//import {RightToolbar} from '../partials/layout/RightToolbar'
import {Sidebar} from '@/layout/components/sidebar'
// } from '@components'
import {PageDataProvider} from './core'
import {reInitMenu} from '@/lib'

const MasterLayout = () => {
  const location = useLocation()
  useEffect(() => {
    reInitMenu()
  }, [location.key])

  return (
    <PageDataProvider>
      <div className="flex min-h-screen w-full bg-gray-200">
      <Sidebar />
        <div className="ml-auto mb-6 w-full lg:w-[75%] xl:w-[94%] 2xl:w-[94%] px-1 lg:px-2">
          <div className="sticky top-1 h-16 bg-white/70 backdrop-blur-lg z-40 lg:py-2.5 rounded-lg">
            <HeaderWrapper />
          </div>
          <Content>
            <Outlet />
          </Content>
        </div>
        <ScrollTop />
      </div>
    </PageDataProvider>
  )
}

export {MasterLayout}
