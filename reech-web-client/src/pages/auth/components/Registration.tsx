/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState, useEffect} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {login, register} from '../core/_requests'
import {Link} from 'react-router-dom'
import {toAbsoluteUrl} from '@/lib'
import {PasswordMeterComponent} from '@/assets/ts/components'
import {useAuth} from '../core/Auth'

const initialValues = {
  fullname: '',
  username: '',
  email: '',
  password: '',
  changepassword: '',
  acceptTerms: false,
}

const registrationSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Wrong email format')
    .lowercase('Use lowercase characters')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  username: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Last name is required'),
  password: Yup.string()
    .min(8, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password is required'),
  changepassword: Yup.string()
    .required('Password confirmation is required')
    .when('password', {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
    }),
  acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
})

export function Registration() {
  const [loading, setLoading] = useState(false)
  const {saveAuth, setCurrentUser} = useAuth()
  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const {data: auth} = await register(
          values.email,
          values.fullname,
          values.username,
          values.password,
          values.changepassword
        )
        saveAuth(auth)
        const {data: user} = await login(values.email, values.password)
        setCurrentUser(user)
      } catch (error: any) {
        console.error(Object.values(error.response.data))
        saveAuth(undefined)
        setStatus(Object.values(error.response.data).toString().replace(/\.,/g, " & "))
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    PasswordMeterComponent.bootstrap()
  }, [])

  return (
    <form
      className='form w-[700px] fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='reech_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className='text-center'>
            <h2 className="text-center text-lg font-bold tracking-tight text-gray-900">
              Register New Account
            </h2>
      </div>
      {/* begin::Heading */}

      {/* begin::Login options */}
      <div className='flex'>
        <div className="my-4 mr-2 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 hover:cursor-pointer">
          <div className="rounded-full text-xl">
            <img
              alt='Google-Logo'
              src={toAbsoluteUrl('/media/svg/brand-logos/google-icon.svg')}
              className=''
            />
          </div>
          <h5 className="text-sm font-medium text-navy-700">
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
          <h5 className="text-sm font-medium text-navy-700 ">
            Sign In with Apple
          </h5>
        </div>
      </div>
      {/* end::Login options */}

      {/* begin::Separator */}
      <div className="mb-4 flex items-center  gap-3">
          <div className="h-px w-full bg-gray-400 " />
          <p className="text-base text-gray-400 "> or </p>
          <div className="h-px w-full bg-gray-400 " />
        </div>
      {/* end::Separator */}

      {formik.status && (
        <div className='my-4 bg-red-100 alert-danger p-2 font-normal text-sm rounded'>
          <div className='text-red-400'>{formik.status}</div>
        </div>
      )}

      {/* begin::Form group Firstname */}
      <div className='mb-3'>
        <label className='text-sm text-navy-700'>Full name:*</label>
        <input
          placeholder='Full name'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('fullname')}
          className={clsx(
            'mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-slate-400 bg-white/0 p-3 text-sm outline-none',
            {'border-red-500': formik.touched.fullname && formik.errors.fullname},
            {
              'border-green-400': formik.touched.fullname && !formik.errors.fullname,
            }
          )}
        />
        {formik.touched.fullname && formik.errors.fullname && (
          <div className='flex'>
            <div className='text-red-500'>
              <span role='alert'>{formik.errors.fullname}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}
      <div className='mb-3'>
        {/* begin::Form group Lastname */}
        <label className='text-sm text-navy-700'>Username:*</label>
        <input
          placeholder='Username'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('username')}
          className={clsx(
            'mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-slate-400 bg-white/0 p-3 text-sm outline-none',
            {'border-red-500': formik.touched.username && formik.errors.username},
            {
              'border-green-400': formik.touched.username && !formik.errors.username,
            }
          )}
        />
        {formik.touched.username && formik.errors.username && (
          <div className='flex'>
            <div className='text-red-500'>
              <span role='alert'>{formik.errors.username}</span>
            </div>
          </div>
        )}
        {/* end::Form group */}
      </div>

      {/* begin::Form group Email */}
      <div className='mb-3'>
        <label className='text-sm text-navy-700'>Email:*</label>
        <input
          placeholder='Email'
          type='email'
          autoComplete='off'
          className={clsx(
            'mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-slate-400 bg-white/0 p-3 text-sm outline-none',
            {'border-red-500': formik.touched.email && formik.errors.email},
            {
              'border-green-400': formik.touched.email && !formik.errors.email,
            }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='flex'>
            <div className='text-red-500'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group Password */}
      <div className='mb-3' data-password-meter='true'>
        <div className='mb-1'>
          <label className='text-sm text-navy-700'>Password:*</label>
          <div className='position-relative mb-3'>
            <input
              type='password'
              placeholder='Password'
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
                <div className='text-red-500'>
                  <span role='alert'>{formik.errors.password}</span>
                </div>
              </div>
            )}
          </div>
          {/* begin::Meter */}
          <div
            className='flex items-center mb-3'
            data-password-meter-control='highlight'
          >
            <div className='grow bg-gray-300 active:bg-green-500 rounded h-[5px] mr-2'></div>
            <div className='grow bg-gray-300 active:bg-green-500 rounded h-[5px] mr-2'></div>
            <div className='grow bg-gray-300 active:bg-green-500 rounded h-[5px] mr-2'></div>
            <div className='grow bg-gray-300 active:bg-green-500 rounded h-[5px]'></div>
          </div>
          {/* end::Meter */}
        </div>
        <div className='text-muted'>
          Use 8 or more characters with a mix of letters, numbers & symbols.
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      <div className='mb-3'>
        <label className='text-sm text-navy-700'>Confirm Password:*</label>
        <input
          type='password'
          placeholder='Password confirmation'
          autoComplete='off'
          {...formik.getFieldProps('changepassword')}
          className={clsx(
            'mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-slate-400 bg-white/0 p-3 text-sm outline-none',
            {
              'border-red-500': formik.touched.password && formik.errors.password,
            },
            {
              'border-green-400': formik.touched.changepassword && !formik.errors.changepassword,
            }
          )}
        />
        {formik.touched.changepassword && formik.errors.changepassword && (
          <div className='flex'>
            <div className='text-red-500'>
              <span role='alert'>{formik.errors.changepassword}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='mb-3'>
        <label className='form-check form-check-inline' htmlFor='reech_login_toc_agree'>
          <input
            className='mr-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600'
            type='checkbox'
            id='reech_login_toc_agree'
            {...formik.getFieldProps('acceptTerms')}
          />
          <span>
            I Accept the{' '}
            <a
              href='#'
              target='_blank'
              className='text-accent'
            >
              Terms
            </a>
            .
          </span>
        </label>
        {formik.touched.acceptTerms && formik.errors.acceptTerms && (
          <div className='flex'>
            <div className='text-red-500'>
              <span role='alert'>{formik.errors.acceptTerms}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='text-center'>
        <button
          type='submit'
          id='reech_sign_up_submit'
          className="linear mt-2 w-full rounded-xl bg-purple-500 py-[12px] text-base font-medium 
          text-white transition duration-200 hover:bg-dark active:bg-dark
            hover:cursor-pointer"
          disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
        >
          {!loading && <span className='indicator-label'>Submit</span>}
          {loading && (
            <>
              <svg className="animate-spin inline -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          )}
        </button>
        <div className='mt-1 text-gray-500 text-center text-sm'>
          Already have an account?{' '}
          <Link to='/auth/login' className='text-accent'>
            Sign in
          </Link>
        </div>
      </div>
      {/* end::Form group */}
    </form>
  )
}
