import OpportunityWizard from '@/components/ui/opportunity-wizard/OpportunityWizard';
import React from 'react';

const ReechForPage = () => {
    return (
        <div className='px-4'>
            <h2 className='text-[24px] text-slate-600 font-semibold mt-1'>Opportunity Card</h2>
            <p className='text-md text-slate-500 mb-4'>Nthabiseng, create your opportunity card.</p>
            <OpportunityWizard />
        </div>
    );
};

export default ReechForPage;