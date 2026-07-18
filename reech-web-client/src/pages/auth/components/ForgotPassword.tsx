import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {requestPassword} from '../core/_requests'

const initialValues = {
  email: '',
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
})

export function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      setTimeout(() => {
        requestPassword(values.email)
          .then(({data: {result}}) => {
            setHasErrors(false)
            setLoading(false)
          })
          .catch(() => {
            setHasErrors(true)
            setLoading(false)
            setSubmitting(false)
            setStatus('The login detail is incorrect')
          })
      }, 1000)
    },
  })

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='login_password_reset_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-10'>
        {/* begin::Title */}
          <h2 className="text-center text-lg font-bold tracking-tight text-gray-900">
            Forgot Password?
           </h2>
        {/* end::Title */}

        {/* begin::Link */}
        <div className='text-gray-500'>
          Enter your email to reset your password.
        </div>
        {/* end::Link */}
      </div>

      {/* begin::Status */}
      {hasErrors === true && (
        <div  className='my-4 bg-red-100 alert-danger p-2 font-normal text-sm rounded'>
          <div className='text-red-500'>
            Sorry, looks like there are some errors detected, please try again.
          </div>
        </div>
      )}

      {hasErrors === false && (
        <div  className='my-4 bg-blue-100 alert-danger p-2 font-normal text-sm rounded'>
          <div className='bg-blue-500'>Sent password reset. Please check your email</div>
        </div>
      )}
      {/* end::Status */}

      {/* begin::Form group */}
      <div className='mb-3'>
        <label className='text-sm text-navy-700'>Email:*</label>
        <input
          type='email'
          placeholder=''
          autoComplete='off'
          {...formik.getFieldProps('email')}
          className={clsx(
            'mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-slate-400 bg-white/0 p-3 text-sm outline-none',
            {'border-red-500': formik.touched.email && formik.errors.email},
            {
              'border-green-500': formik.touched.email && !formik.errors.email,
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

      {/* begin::Form group */}
      <div className='flex flex-wrap justify-center lg:pb-0'>
        <button 
          type='submit' 
          id='password_reset_submit' 
          className="linear mt-2 w-full rounded-xl bg-purple-500 py-[12px] text-base font-medium 
          text-white transition duration-200 hover:bg-dark active:bg-dark"
        >
          <span className='indicator-label'>Submit</span>
          {loading && (
            <span className='indicator-progress'>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <div className='mt-1 text-gray-500 text-center text-sm'>
          Remembered your password?{' '}
          <Link to='/auth/login' className='text-accent'>
            Sign in
          </Link>
        </div>
        {' '}
      </div>
      {/* end::Form group */}
    </form>
  )
}
