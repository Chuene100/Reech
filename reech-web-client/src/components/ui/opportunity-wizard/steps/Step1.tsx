/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {Field, ErrorMessage} from 'formik'
import { SVG } from '@/lib'
import clsx from 'clsx'

const Step1: FC = () => {
  return (
    <div className='w-full'>
      <div className='pb-10 lg:pb-15'>
        <h2 className='font-bold flex items-center text-dark text-xl'>
          Card Details
        </h2>
      </div>

      <div className='flex flex-col gap-3'>
        {/* begin::Form group Title */}
        <div className='mb-3'>
          <label className='text-sm text-navy-700 '>
            Title:<span className='text-red-400 ml-1'>*</span>
          </label>
          <Field
            name='cardTitle'
            type='text'
            autoComplete='off'
            className={clsx('mt-2 flex h-12 w-full items-center justify-center rounded-xl border-0 \
            bg-white/0 p-3 text-sm outline-none bg-slate-200',)}
          />
          <div className='text-red-500 mt-2'>
            <ErrorMessage name='cardTitle' />
          </div>
        </div>

        {/* begin::Form group Industry */}
        <div className='mb-3'>
          <label className='text-sm text-navy-700 '>
            Industry:<span className='text-red-400 ml-1'>*</span>
          </label>
          <Field
            as='select'
            name='industry'
            className={clsx('mt-2 flex h-12 w-full items-center justify-center rounded-xl border-0 \
            bg-white/0 p-3 text-sm outline-none bg-slate-200',)}
          >
            <option></option>
            <option value='1'>Medicine</option>
            <option value='1'>Science</option>
            <option value='2'>Legal</option>
            <option value='3'>Commerce</option>
            <option value='4'>Marketing</option>
            <option value='5'>General</option>
          </Field>
          <div className='text-red-500 mt-2'>
            <ErrorMessage name='industry' />
          </div>
        </div>

        {/* begin::Form group Function */}
        <div className='mb-3'>
          <label className='text-sm text-navy-700 '>
            Function:<span className='text-red-400 ml-1'>*</span>
          </label>
          <Field
            as='select'
            name='function'
            className={clsx('mt-2 flex h-12 w-full items-center justify-center rounded-xl border-0 \
            bg-white/0 p-3 text-sm outline-none bg-slate-200',)}
          >
            <option></option>
            <option value='1'>Researcher</option>
            <option value='1'>Legal Pracitioner</option>
            <option value='2'>Bursar</option>
            <option value='3'>Senior Actuary</option>
            <option value='4'>Marketer</option>
            <option value='5'>Developer</option>
          </Field>
          <div className='text-red-500 mt-2'>
            <ErrorMessage name='function' />
          </div>
        </div>

        {/* begin::Form group Level */}
        <div className='mb-3'>
          <label className='text-sm text-navy-700 '>
            Level:<span className='text-red-400 ml-1'>*</span>
          </label>
          <Field
            as='select'
            name='level'
            className={clsx('mt-2 flex h-12 w-full items-center justify-center rounded-xl border-0 \
            bg-white/0 p-3 text-sm outline-none bg-slate-200',)}
          >
            <option></option>
            <option value='1'>Intern</option>
            <option value='1'>Junior</option>
            <option value='2'>Senior</option>
          </Field>
          <div className='text-red-500 mt-2'>
            <ErrorMessage name='level' />
          </div>
        </div>

        {/* begin::Form group Education */}
        <div className='mb-3'>
          <label className='text-sm text-navy-700 '>
            Education:<span className='text-red-400 ml-1'>*</span>
          </label>
          <Field
            as='select'
            name='education'
            className={clsx('mt-2 flex h-12 w-full items-center justify-center rounded-xl border-0 \
            bg-white/0 p-3 text-sm outline-none bg-slate-200',)}
          >
            <option></option>
            <option value='1'>High School</option>
            <option value='1'>Diploma</option>
            <option value='2'>Bachelor's Degree</option>
            <option value='2'>Master's Degree</option>
            <option value='2'>PHd</option>
          </Field>
          <div className='text-red-500 mt-2'>
            <ErrorMessage name='education' />
          </div>
        </div>

        {/* begin::Form group Experience */}
        <div className='mb-3'>
          <label className='text-sm text-navy-700 '>
            Experience:<span className='text-red-400 ml-1'>*</span>
          </label>
          <Field
            as='select'
            name='experience'
            className={clsx('mt-2 flex h-12 w-full items-center justify-center rounded-xl border-0 \
            bg-white/0 p-3 text-sm outline-none bg-slate-200',)}
          >
            <option></option>
            <option value='1'>0 years</option>
            <option value='1'>1 - 2 years</option>
            <option value='2'>3 - 5 years</option>
            <option value='2'>5 - 10 years</option>
            <option value='2'>over 10 years</option>
          </Field>
          <div className='text-red-500 mt-2'>
            <ErrorMessage name='experience' />
          </div>
        </div>
        
      </div>      
    </div>
  )
}

export {Step1}
