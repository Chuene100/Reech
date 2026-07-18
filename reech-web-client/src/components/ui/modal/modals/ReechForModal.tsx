import React from 'react';
import OpportunityCard from '@/components/cards/OpportunityCard';
import { toAbsoluteUrl } from '@/lib';
import ReechForCard from '@/components/cards/ReechForCard';
import { Link } from 'react-router-dom';
import XLargeModalWrapper from '../modal-wrappers/XLargeModalWrapper';

interface Props {
    closeModal?: any
}

const ReechForModal: React.FC<Props>= ({closeModal}) => {
    return (
    <>
        <XLargeModalWrapper 
            closeModal={closeModal}
            title='My Reech For:'
        >
            <div className='flex gap-5'>
                <Link to='/my-reech/reech-for'>
                    <ReechForCard title='Winners & Supporters' image='/media/misc/Legal-Executive.jpg'/>
                </Link>
                <Link to='/my-reech/reech-for'>
                    <ReechForCard title='Service Providers' image='/media/misc/receptionist.jpg'/>
                </Link>
                <Link to='/my-reech/reech-for'>
                    <ReechForCard title='New Hires' image='/media/misc/new_hires.jpg'/>
                </Link>
            </div>
        </XLargeModalWrapper>
        </>
       
    );
};

export default ReechForModal;