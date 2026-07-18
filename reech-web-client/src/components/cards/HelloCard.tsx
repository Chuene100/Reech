import Card from '../ui/Card';
import React, { useState } from 'react';
import Button from '../ui/Button';
import clsx from 'clsx';
import { toAbsoluteUrl } from '@/lib';
import { Link, useLocation } from 'react-router-dom';
import { useModalAction } from '../ui/modal/Modal.Context';
import ReechForModal from '../ui/modal/modals/ReechForModal';

interface Props {
    className?: string
}

const HelloCard: React.FC<Props> = ({className}) => {
    const {openModal} = useModalAction()
    const [showModal, setShowModal] = useState(false)

    return (
        <Card
            style={{
                backgroundImage: `url(${toAbsoluteUrl('/media/misc/Coca-cola.jpg')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center'
            }}
            className={clsx(className)}
        >
            <div className='flex flex-col pb-9 pt-5 w-full'>
                <div className="flex justify-center text-white">
                    <h2 className=' justify-center text-3xl drop-shadow-[0px_5px_15px_rgba(0,0,0,0.8)]'>
                        Hello, <b>Nthabiseng!</b> 😀
                    </h2>
                </div>
                <h4 className='flex justify-center text-white text-xl mt-3 drop-shadow-[0px_5px_15px_rgba(0,0,0,0.8)]'>
                    Welcome! What would you like to do today?
                </h4>

                <div className='flex justify-center mt-11'>
                    <div className='flex flex-col'>
                        <button
                            onClick={() => setShowModal(true)}
                            className='bg-fuchsia-600 text-white font-normal text-lg px-24 py-3 flex justify-center rounded-lg'
                        >
                            Reech For
                        </button>
                        {showModal ? (
                        <>
                            <ReechForModal 
                                closeModal={()=>setShowModal(false)}
                            />
                        </>
                    ) : null}
                        <Link
                            className='bg-white text-fuchsia-600 font-normal text-lg py-3 px-24 flex justify-center rounded-lg mt-3'
                            to={'/opportunity'}
                        >
                            See Who I Have Been Reeched By
                        </Link>
                    </div>
                </div>
            </div>
        </Card> 
    );
};

export default HelloCard;