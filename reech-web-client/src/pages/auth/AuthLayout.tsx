/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect} from 'react'
import {Outlet, Link} from 'react-router-dom'
import {toAbsoluteUrl} from '@/lib'

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.style.height = '100%'
    }
    return () => {
      if (root) {
        root.style.height = 'auto'
      }
    }
  }, [])

  return (
    <div 
      className='flex min-h-screen items-center justify-center py-5 px-4 sm:px-6 lg:px-8'
      style={{
        backgroundImage: `url('/media/misc/Sign-in.jpg')`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* begin::Body */}
      <div className='flex flex-col p-10'>
        <div className='flex text-[36px] gap-5 drop-shadow-md text-white mb-5'>
          <span>Welcome to</span>
          <div className='w-56'>
              <img 
                  src="/media/logos/logo-white.png" 
                  alt='logo'
                  className='object-cover drop-shadow-sm'
              />
          </div>
          <span className="">Enterprise!</span>
        </div>
        {/* begin::Wrapper  */}
        <div className='lg:min-w-[550px] bg-white/20 backdrop-blur-sm rounded-lg border border-white p-3'>
          {/* begin::Form */}
          <div className='backdrop-blur-lg bg-white rounded-lg py-10 px-11'>
              <Outlet />
          </div>
          {/* end::Form */}
        </div>
        {/* end::Wrapper */}

        {/* begin::Footer */}
        <div className='flex justify-center flex-wrap px-5'>
          {/* begin::Links */}
          <div className='flex fw-semibold text-primary fs-base'>
            <a href='#' className='px-5' target='_blank'>
              Terms
            </a>

            <a href='#' className='px-5' target='_blank'>
              Contact Us
            </a>
          </div>
          {/* end::Links */}
        </div>
        {/* end::Footer */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {AuthLayout}
