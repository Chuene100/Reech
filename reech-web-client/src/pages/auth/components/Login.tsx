/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import { toAbsoluteUrl } from '@/lib'
import { useLogin } from '@/rest-api/auth'
import { LoginUserInput } from '@/types'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .lowercase('Use lowercase characters')
    .max(50, 'Maximum 50 characters')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Minimum 8 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password is required'),
})

const initialValues = {
  email: 'admin@coca_cola.com',
  password: 'coca_cola_reecher',
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const { mutate: login, isLoading, serverError, setServerError } = useLogin();

  const formik = useFormik<LoginUserInput>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values: any) => {
        login({email: values.email, password: values.password})
    },
  })
  // src={toAbsoluteUrl('/media/svg/brand-logos/google-icon.svg')}


  return (
    <form
      className='form'
      onSubmit={formik.handleSubmit}
      noValidate
      id='login_signin_form'
    >
      {/* begin::Heading */}
      <div className='text-center'>
            <h2 className="text-center text-lg font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
      </div>
      {/* begin::Heading */}

      {/* begin::Login options */}
      <div className='flex'>
        <div className="my-4 mr-2 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 hover:cursor-pointer ">
          <div className="rounded-full text-xl">
            <img
              alt='Google-Logo'
              src={toAbsoluteUrl('/media/svg/brand-logos/google-icon.svg')}
              className=''
            />
          </div>
          <h5 className="text-sm font-medium text-navy-700 ">
            Sign In with Google
          </h5>
        </div>

        <div className="my-4 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 hover:cursor-pointer ">
          <div className="rounded-full text-xl">
            <img
              alt='Google-Logo'
              src={toAbsoluteUrl('/media/svg/brand-logos/apple-black.svg')}
              className=''
            />
          </div>
          <h5 className="text-sm font-medium text-navy-700">
            Sign In with Apple
          </h5>
        </div>
      </div>
      
      {/* end::Login options */}

      {/* begin::Separator */}
        <div className="mb-4 flex items-center  gap-3">
          <div className="h-px w-full bg-gray-400 " />
          <p className="text-base text-gray-400"> or </p>
          <div className="h-px w-full bg-gray-400" />
        </div>
      {/* end::Separator */}

      {serverError && (
        <div className='my-4 bg-red-100 alert-danger p-2 font-normal text-sm rounded'>
          <div className='text-red-400'>{serverError}</div>
        </div>
      )}

      {/* begin::Form group */}
      <div className=''>
        <label className='text-sm text-navy-700'>Email:</label>
        <input
          // placeholder='username'
          {...formik.getFieldProps('email')}
          className={clsx(
            'mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-slate-400 bg-white/0 p-3 text-sm outline-none',
            {'border-red-500': formik.touched.email && formik.errors.email},
            {
              'border-green-400': formik.touched.email && !formik.errors.email,
            }
          )}
          type='email'
          name='email'
          autoComplete='off'
        />
        {formik.touched.email && formik.errors.email && (
          <div className='flex text-red-500 text-sm mb-2'>
            <span role='alert'>{formik.errors.email}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-3'>
        <label className='text-sm text-navy-700'>Password:</label>
        <input
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-slate-400 bg-white/0 p-3 text-sm outline-none',
            {
              'border-red-500': formik.touched.password && formik.errors.password,
            },
            {
              'border-green-400': formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='flex'>
            <div className='text-red-500 text-sm'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className='flex flex-stack flex-wrap text-cyan-600 text-base font-semibold mb-3'>
        <div />

        {/* begin::Link */}
        <div className="mb-4 flex items-center justify-between px-2">
          <Link
            to='/auth/forgot-password'
            className="text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            Forgot Password?
          </Link>
        </div>
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      {/* <div className='grid'>
        <button 
          type='submit'
          id='sign_in_submit'
          disabled={isLoading || !formik.isValid}
          className={clsx("linear mt-2 w-full rounded-xl bg-purple-500 py-[12px] text-base font-medium \
          text-white transition duration-200 hover:bg-dark active:bg-dark  \
          hover:cursor-pointer", 
          {'bg-gray-400 hover:bg-gray-400 hover:cursor-not-allowed': !formik.isValid}
          )}
        >
          {!isLoading && <span className='indicator-label'>Sign In</span>}
          {isLoading && (
            <>
              <svg className="animate-spin inline -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          )}
        </button>
      </div> */}
      {/* end::Action */}

      {/* this is a temporary fake signin */}
      <Link
          to='/landing-page' 
          className={clsx("flex justify-center mt-2 w-full rounded-xl bg-purple-500 py-[12px] text-base font-medium \
          text-white transition duration-200 hover:bg-dark active:bg-dark  \
           hover:cursor-pointer")}
        >
          <span className='indicator-label'>Sign In</span>
        </Link>
      {/* end temporary */}

      <div className='mt-1 text-gray-500 text-center text-sm'>
        No account yet?{' '}
        <Link to='/auth/registration' className='text-accent'>
          Sign up
        </Link>
      </div>
    </form>
  )
}
