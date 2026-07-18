import { toAbsoluteUrl } from '@/lib';
import React from 'react';
import { Link } from 'react-router-dom';

const Rater = () => {
    return (
        <div className='h-full flex flex-col justify-between'>
            <div style={{textAlign: 'center'}}>
                <h4 className='text-lg font-semibold'>Benchmarking your <Link to='/opportunity/understand' className='text-purple-500'>Junoir Bookkeeper</Link> role</h4>
            </div>
            <div className="flex flex-row ">
                <div className='mt-5' style={{width: '45%', marginRight: '10%'}}>
                    <h4>Your Offer:</h4>
                    <div className='mt-3'>
                        <div className="flex flex-row ">
                            <div className='bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-6 w-full'></div>
                            <img
                                alt='sad-emoji'
                                src={toAbsoluteUrl('/media/svg/general/sad.svg')}
                                className=''
                                style={{width: '4vw', height: '4vh'}}
                            />
                        </div>
                    </div>
                </div>

                <div className='mt-5' style={{width: '45%'}}>
                    <h4>The suggested rate is:</h4>
                    <div className='mt-3 border border-black/40 rounded' style={{height: '10vh'}}>
                        <h2 className='mt-2 text-[32px] text-center'>R6,900</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rater;