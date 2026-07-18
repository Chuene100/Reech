import ReecherProfileCard from '@/components/cards/ReecherProfileCard';
import Button from '@/components/ui/Button';
import React from 'react';

const DefineMyCards = () => {
    return (
        <div>
            <div className='p-5 border border-slate-400 rounded-lg'>
                <h4 className='text-center text-slate-500 mb-2'>How your preview will look.</h4>
                <div className='flex justify-center'>
                    <ReecherProfileCard
                        name='Moneng Khumalo'
                        location='Midrand'
                        duration='5 years'
                        education='Degree'
                        className='bg-blue-500'
                    />
                </div>   
            </div>

            <section>
                <h4 className='text-xl text-purple-500 mt-5'>Select your 3 cards review items:</h4>
                <div className='grid grid-cols-3 gap-10 py-5'>
                    <Button
                        variant='custom'
                        size='small'
                        className='bg-purple-500 text-white font-normal text-sm px-8 w-full'
                    >
                        Location 
                    </Button>

                    <Button
                        variant='custom'
                        size='small'
                        className='bg-purple-500 text-white font-normal text-sm px-8 w-full'
                    >
                        Experience 
                    </Button>

                    <Button
                        variant='custom'
                        size='small'
                        className='bg-purple-500 text-white font-normal text-sm px-8 w-full'
                    >
                        Education 
                    </Button>
                </div>

                <p className='text-lg text-slate-500'>
                    Use smart sourcing:
                    <input type="checkbox" className='ml-2 rounded'/>
                </p>
            </section>

            <section className='py-4'>
                <h4 className='text-xl text-purple-500 mt-5'>Define your prioritisation criteria:</h4>

                <div className='grid grid-cols-3 gap-5 pt-5'>
                    <h5 className='mb-5 text-slate-600 text-lg'>Criteria</h5>
                    <h5 className='mb-5 text-slate-600 text-lg'>Your Target</h5>
                    <h5 className='mb-5 text-slate-600 text-lg'>Ranking (/100)</h5>
                </div>

                <div className='grid grid-cols-3 gap-5'>
                    <div className='flex flex-col gap-2'>
                        <Button
                            variant='custom'
                            size='small'
                            className='bg-purple-500 text-white font-normal text-sm px-8 w-full'
                        >
                            Education 
                        </Button>

                        <Button
                            variant='custom'
                            size='small'
                            className='bg-purple-500 text-white font-normal text-sm px-8 w-full'
                        >
                            Gender 
                        </Button>

                        <Button
                            variant='custom'
                            size='small'
                            className='bg-purple-500 text-white font-normal text-sm px-8 w-full'
                        >
                            Income Expectation 
                        </Button>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <select className='bg-gray-50 border border-gray-300 rounded w-full'>
                            <option selected>Choose Education Level</option>
                            <option>Matric</option>
                            <option>Diploma</option>
                            <option>Degree</option>
                        </select>

                        <select className='bg-gray-50 border border-gray-300 rounded w-full'>
                            <option selected>Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>

                        <input type='text' className='bg-gray-50 border border-gray-300 rounded w-full' />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <input type='text' className='bg-gray-50 border border-gray-300 rounded w-full' />
                        <input type='text' className='bg-gray-50 border border-gray-300 rounded w-full' />
                        <input type='text' className='bg-gray-50 border border-gray-300 rounded w-full' />
                    </div>

                </div>
            </section>
            
        </div>
    );
};

export default DefineMyCards;