import { StepperComponent } from '@/assets/ts/components';
import React, { useEffect, useRef, useState } from 'react';
import { ICreateAccount, createAccountSchemas, inits } from './CreateOpportunityWizardHelper';
import { Form, Formik, FormikValues } from 'formik';
import Card from '../Card';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import { Step4 } from './steps/Step4';
import { Step5 } from './steps/Step5';
import { Step6 } from './steps/Step6';

const OpportunityWizard = () => {
    
  const stepperRef = useRef<HTMLDivElement | null>(null)
  const stepper = useRef<StepperComponent | null>(null)
  const [currentSchema, setCurrentSchema] = useState(createAccountSchemas[0])
  const [initValues] = useState<ICreateAccount>(inits)

  const loadStepper = () => {
    stepper.current = StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
  }

  const prevStep = () => {
    if (!stepper.current) {
      return
    }

    stepper.current.goPrev()

    setCurrentSchema(createAccountSchemas[stepper.current.currentStepIndex - 1])
  }

  const submitStep = (values: ICreateAccount, actions: FormikValues) => {
    if (!stepper.current) {
      return
    }

    setCurrentSchema(createAccountSchemas[stepper.current.currentStepIndex])

    if (stepper.current.currentStepIndex !== stepper.current.totatStepsNumber) {
      stepper.current.goNext()
    } else {
      stepper.current.goto(1)
      actions.resetForm()
    }
  }

  useEffect(() => {
    if (!stepperRef.current) {
      return
    }

    loadStepper()
  }, [stepperRef])

  return (
    <div
      ref={stepperRef}
      className='stepper stepper-pills stepper-column flex flex-col lg:flex-row justify-between gap-3 w-full'
      id='create_account_stepper'
    >
      {/* begin::Aside*/}
      <div className='flex h-[75vh] basis-1/3'>
        <Card className='flex justify-center xl:justify-start overflow-scroll row-auto w-full'>
            {/* begin::Wrapper*/}
            <div className='px-6 lg:px-10 2xl:px-15 py-10'>
            {/* begin::Nav*/}
            <div className='stepper-nav'>
                {/* begin::Step 1*/}
                <div className='stepper-item current' data-stepper-element='nav'>
                {/* begin::Wrapper*/}
                <div className='stepper-wrapper'>
                    {/* begin::Icon*/}
                    <div className='stepper-icon w-[40px] h-[40px]'>
                    <i className='stepper-check fas fa-check'></i>
                    <span className='stepper-number'>1</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className='stepper-label'>
                    <h3 className='stepper-title'>Card Details</h3>

                    <div className='stepper-desc'>Specify basic card information</div>
                    </div>
                    {/* end::Label*/}
                </div>
                {/* end::Wrapper*/}

                {/* begin::Line*/}
                <div className='stepper-line h-[40px]'></div>
                {/* end::Line*/}
                </div>
                {/* end::Step 1*/}

                {/* begin::Step 2*/}
                <div className='stepper-item' data-stepper-element='nav'>
                {/* begin::Wrapper*/}
                <div className='stepper-wrapper'>
                    {/* begin::Icon*/}
                    <div className='stepper-icon w-40px h-[40px]'>
                    <i className='stepper-check fas fa-check'></i>
                    <span className='stepper-number'>2</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className='stepper-label'>
                    <h3 className='stepper-title'>Location & Dates</h3>
                    <div className='stepper-desc'>Provide specified information</div>
                    </div>
                    {/* end::Label*/}
                </div>
                {/* end::Wrapper*/}

                {/* begin::Line*/}
                <div className='stepper-line h-[40px]'></div>
                {/* end::Line*/}
                </div>
                {/* end::Step 2*/}

                {/* begin::Step 3*/}
                <div className='stepper-item' data-stepper-element='nav'>
                {/* begin::Wrapper*/}
                <div className='stepper-wrapper'>
                    {/* begin::Icon*/}
                    <div className='stepper-icon w-40px h-[40px]'>
                    <i className='stepper-check fas fa-check'></i>
                    <span className='stepper-number'>3</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className='stepper-label'>
                    <h3 className='stepper-title'>Rates</h3>
                    <div className='stepper-desc'>Set the rate for this card</div>
                    </div>
                    {/* end::Label*/}
                </div>
                {/* end::Wrapper*/}

                {/* begin::Line*/}
                <div className='stepper-line h-[40px]'></div>
                {/* end::Line*/}
                </div>
                {/* end::Step 3*/}

                {/* begin::Step 4*/}
                <div className='stepper-item' data-stepper-element='nav'>
                {/* begin::Wrapper*/}
                <div className='stepper-wrapper'>
                    {/* begin::Icon*/}
                    <div className='stepper-icon w-40px h-[40px]'>
                    <i className='stepper-check fas fa-check'></i>
                    <span className='stepper-number'>4</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className='stepper-label'>
                    <h3 className='stepper-title'>Scaling</h3>
                    <div className='stepper-desc'>Specify traffic and reach</div>
                    </div>
                    {/* end::Label*/}
                </div>
                {/* end::Wrapper*/}

                {/* begin::Line*/}
                <div className='stepper-line h-[40px]'></div>
                {/* end::Line*/}
                </div>
                {/* end::Step 4*/}

                {/* begin::Step 5*/}
                <div className='stepper-item' data-stepper-element='nav'>
                {/* begin::Wrapper*/}
                <div className='stepper-wrapper'>
                    {/* begin::Icon*/}
                    <div className='stepper-icon w-40px h-[40px]'>
                    <i className='stepper-check fas fa-check'></i>
                    <span className='stepper-number'>5</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className='stepper-label'>
                    <h3 className='stepper-title'>Card Media</h3>
                    <div className='stepper-desc'>Upload background image</div>
                    </div>
                    {/* end::Label*/}
                </div>
                {/* end::Wrapper*/}

                {/* begin::Line*/}
                <div className='stepper-line h-[40px]'></div>
                {/* end::Line*/}
                </div>
                {/* end::Step 5*/}

                {/* begin::Step 6*/}
                <div className='stepper-item' data-stepper-element='nav'>
                {/* begin::Wrapper*/}
                <div className='stepper-wrapper'>
                    {/* begin::Icon*/}
                    <div className='stepper-icon w-40px h-[40px]'>
                    <i className='stepper-check fas fa-check'></i>
                    <span className='stepper-number'>6</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className='stepper-label'>
                    <h3 className='stepper-title'>Completed</h3>
                    <div className='stepper-desc'>Yeah! We are there</div>
                    </div>
                    {/* end::Label*/}
                </div>
                {/* end::Wrapper*/}
                </div>
                {/* end::Step 6*/}
            </div>
            {/* end::Nav*/}
            </div>
            {/* end::Wrapper*/}
        </Card>
      </div>
      
      {/* begin::Aside*/}

      <div className='flex h-[75vh] basis-2/3'>
        <div className='flex flex-center bg-white rounded end overflow-scroll w-full'>
            <Formik validationSchema={currentSchema} initialValues={initValues} onSubmit={submitStep}>
            {() => (
                <Form className='py-10 w-full px-9' noValidate id='create_account_form'>
                <div className='current' data-stepper-element='content'>
                    <Step1 />
                </div>

                <div data-stepper-element='content'>
                    <Step2 /> 
                </div>

                <div data-stepper-element='content'>
                    <Step3 /> 
                </div>

                <div data-stepper-element='content'>
                    <Step4 />
                </div>

                <div data-stepper-element='content'>
                    <Step5 />
                </div>

                <div data-stepper-element='content'>
                    <Step6 />
                </div>

                <div className='flex w-full justify-between pt-10'>
                    <div className='mr-2'>
                    <button
                        onClick={prevStep}
                        type='button'
                        className='flex justify-center items-center bg-purple-500 py-2 px-5 mb-2 text-white rounded-lg mr-3'
                        data-stepper-action='previous'
                    >
                        <span className='indicator-label'>Back</span>
                    </button>
                    </div>

                    <div>
                    <button 
                        type='submit' 
                        className='flex items-center bg-purple-500 py-2 px-5 mb-2 text-white rounded-lg ml-3'
                    >
                        <span className='indicator-label'>
                        {stepper.current?.currentStepIndex !==
                            stepper.current?.totatStepsNumber! - 1 && 'Continue'}
                        {stepper.current?.currentStepIndex ===
                            stepper.current?.totatStepsNumber! - 1 && 'Submit'}
                        </span>
                    </button>
                    </div>
                </div>
                </Form>
            )}
            </Formik>
        </div>
      </div>
      
    </div>
  )

};

export default OpportunityWizard;