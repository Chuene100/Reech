import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '@/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '@/pages/dashboard/DashboardWrapper'
import {getCSSVariableValue} from '@/assets/ts/_utils'
import {WithChildren} from '@/lib'
import { MyBubblePage } from '@/pages/my-bubble/MyBubblePage'
import { ChatsPage } from '@/pages/chats/ChatsPage'
import HomePage from '@/pages/home/HomePage'
import ReechForPage from '@/pages/reech-for/ReechForPage'


const PrivateRoutes = () => {
  const OpportunityPage = lazy(() => import('@/pages/opportunity/OpportunityPage'))
  const MyReech = lazy(() => import('@/pages/my-reech/MyReech'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='home' element={<HomePage />} />
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='my-bubble' element={<MyBubblePage />} />
        <Route path='chats' element={<ChatsPage />} />
        <Route path='my-reech/reech-for' element={<ReechForPage />} />

        {/* Lazy Modules */}
        <Route
          path='opportunity/:id/*'
          element={
            <SuspensedView>
              <OpportunityPage />
            </SuspensedView>
          }
        />
        <Route
          path='opportunity/*'
          element={
            <SuspensedView>
              <MyReech />
            </SuspensedView>
          }
        />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = 'green'
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
