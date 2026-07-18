import React from 'react';
import { Link } from 'react-router-dom';

const OldRater = () => {
    return (
        <div className='h-full flex flex-col justify-between'>
            <h4 className='text-lg font-semibold'>Benchmarking your <Link to='/opportunity/understand' className='text-purple-500'>Bookkeeper</Link> role</h4>
            <div>
                <h4>Your Offer</h4>
                <div>
                    <div className='bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-6 w-full rounded'></div>
                </div>
            </div>

            <div className='mt-5'>
                <h4>The suggested rate is:</h4>
                <div className='mt-3 border border-black/40 rounded'>
                    <h2 className='text-[64px] text-center'>R6,900</h2>
                </div>
            </div>

            <div className='text-sm'>
                Open a role to view its benchmarks. <Link to='/opportunity' className='text-purple-500'>View Roles</Link>
            </div>
            
        </div>
    );
};

export default OldRater;