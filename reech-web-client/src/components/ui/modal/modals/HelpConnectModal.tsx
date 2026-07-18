import React from 'react';
import ReechForCard from '@/components/cards/ReechForCard';
import { Link } from 'react-router-dom';
import LargeModalWrapper from '../modal-wrappers/LargeModalWrapper';
import Button from '../../Button';

interface Props {
    closeModal?: any
}

const HelpConnectModal: React.FC<Props>= ({closeModal}) => {
    return (
    <>
        <LargeModalWrapper 
            closeModal={closeModal}
            title="Let's Help You Connect:"
        >
            <div>
                <h4 className='text-lg text-center'>
                    <span className='font-bold'>Nthabiseng,</span> confirming that you would like to reech <span className='text-purple-500 font-bold'>4</span> individuals?
                </h4>

                <div className='my-4 flex justify-between'>
                    <select className='bg-gray-50 border border-gray-300 rounded'>
                        <option selected>Review Selected Candidates</option>
                    </select>

                    <select className='bg-gray-50 border border-gray-300 rounded'>
                        <option selected>Schedule Send</option>
                    </select>
                </div>
                

                <div className='flex flex-row justify-around py-3'>
                    <div>
                        <Button
                        variant='custom'
                        size='small'
                        className='bg-purple-500 text-white font-normal text-sm px-8'
                        >
                            Open a blank chat
                            <i className="iconly-Message icbo ml-2"></i> 
                        </Button>
                    </div>
                    <div>
                        <Button
                        variant='custom'
                        size='small'
                        className='bg-purple-500 text-white font-normal text-sm px-8'
                        >
                            Send Message
                            <i className="iconly-Send icbo ml-2"></i> 
                        </Button>
                    </div>
                </div>
                <span className='text-slate-400 text-sm'>
                    Type out your message below (use {`<name>`}, wherever 
                    you wish to refer to a candidate’s name if sending this message to more than 1candidate)
                </span>
                <textarea className='w-full h-32 rounded bg-gray-50 border border-gray-300'/>
                <Button
                    variant='custom'
                    size='small'
                    className='bg-purple-500 text-white font-normal text-sm px-8 w-full'
                >
                    Reech!
                </Button>
            </div>
        </LargeModalWrapper>
        </>
       
    );
};

export default HelpConnectModal;