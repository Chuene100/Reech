import React, {FC} from 'react'
import {Field, ErrorMessage, useField} from 'formik'
import { SVG } from '@/lib'
import clsx from 'clsx'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

const Step2: FC = () => {
  const FormDatePicker = ({name = ''}) => {
  const [field, meta, helpers] = useField(name);

  const { value } = meta;
  const { setValue } = helpers;

  return (
    <DatePicker
      {...field}
      selected={value}
      onChange={(date) => setValue(date)}
      className={clsx('mt-2 flex h-12 w-full items-center justify-center rounded-xl border-0 \
      bg-white/0 p-3 text-sm outline-none bg-slate-200',)}
    />
  );
};

  
  return (
    <div className='w-full'>
      <div className='pb-10 lg:pb-15'>
        <h2 className='font-bold flex items-center text-dark text-xl'>
          Location & Dates
        </h2>
      </div>

      <div className='flex flex-col gap-3'>
        {/* begin::Form group Title */}
        <div className='mb-3'>
          <label className='text-sm text-navy-700'>
            Date:<span className='text-red-400 ml-1'>*</span>
          </label>
          <FormDatePicker name='date' />
          <div className='text-red-500 mt-2'>
            <ErrorMessage name='date' />
          </div>
        </div>

        {/* begin::Form group Location */}
        <div className='mb-3'>
          <label className='text-sm text-navy-700'>
            Location:<span className='text-red-400 ml-1'>*</span>
          </label>
          <Field
            as='select'
            name='location'
            className={clsx('mt-2 flex h-12 w-full items-center justify-center rounded-xl border-0 \
            bg-white/0 p-3 text-sm outline-none bg-slate-200',)}
          >
            <option></option>
            <option value='1'>South Africa</option>
            <option value='1'>America</option>
            <option value='2'>UK</option>
            <option value='3'>Zimbabwe</option>
            <option value='4'>Australia</option>
            <option value='5'>Brazil</option>
          </Field>
          <div className='text-red-500 mt-2'>
            <ErrorMessage name='location' />
          </div>
        </div>
        
      </div>      
    </div>
  )
}

export {Step2}
