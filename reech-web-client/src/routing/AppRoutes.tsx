import {FC} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
import {ErrorsPage} from '@/modules/errors/ErrorsPage'
import {Logout, AuthPage, useAuth} from '@/pages/auth'
import {App} from '@/pages/_app'
import { useLogin } from '@/rest-api/auth'
import LandingPage from '@/pages/landing-page/LandingPage'

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const {PUBLIC_URL} = process.env

const AppRoutes: FC = () => {
  const {isAuthorized} = useLogin()
  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />

          {/* temporary until auth is implemented */}
          <Route index element={<Navigate to='auth/login' />} />
          <Route path='auth/*' element={<AuthPage />} />
          <Route path='/landing-page' element={<LandingPage />} />
          <Route path='/*' element={<PrivateRoutes />} />
        
          {/* end temporary */}


          {/* {isAuthorized ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route index element={<Navigate to='/dashboard' />} />
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )} */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
