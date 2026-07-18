import ReecherProfileCard from '@/components/cards/ReecherProfileCard';
import Button from '@/components/ui/Button';
import { useModalAction } from '@/components/ui/modal/Modal.Context';
import HelpConnectModal from '@/components/ui/modal/modals/HelpConnectModal';
import React, { useState } from 'react';

const USERS = [
    // {
    //     name: 'Lauren Jacobs',
    //     location: 'Ormonde',
    //     duration: '2-3 years',
    //     education: 'Diploma',
    //     avatar: 'avatar-17.JPG'
    // },
    // {
    //     name: 'Anele Jabane',
    //     location: 'Soweto',
    //     duration: '1-2 years',
    //     education: 'Matric',
    //     avatar: 'avatar-18.JPG'
    // },
    // {
    //     name: 'Thabo Moyo',
    //     location: 'Sandton',
    //     duration: '0-1 years',
    //     education: 'Degree',
    //     avatar: 'avatar-13.jpg'
    // },
    {
        name: 'Angela Dlamini',
        location: 'Rivonia',
        duration: '3 years',
        education: 'Diploma',
        avatar: 'avatar-16.jpg'
    },
    {
        name: 'Sam Nkosi',
        location: 'Midrand',
        duration: '3 years',
        education: 'Diploma',
        avatar: 'avatar-12.jpg'
    },
    {
        name: 'Anesu Banda',
        location: 'Cape Town',
        duration: '3 years',
        education: 'Matric',
        avatar: 'avatar-14.jpg'
    },
    {
        name: 'Kate Givens',
        location: 'Cape Town',
        duration: '5 years',
        education: 'Degree',
        avatar: 'avatar-15.jpg'
    },
]

const SeeWhosBeenReeched = () => {
    const [selected, setSelected] = useState<any[]>([]);
    const {openModal} = useModalAction()
    const [showModal, setShowModal] = useState(false)

    return (
        <div>
            <div className='flex justify-end my-2'>
                <Button
                    onClick={() => setShowModal(true)}
                    variant='custom'
                    size='small'
                    className='bg-purple-500 text-white font-normal text-sm px-8'
                    data-bs-toggle='modal'
                    data-bs-target='#modal_offer_a_deal'
                >
                  Reech 
                </Button>
                {showModal ? (
                    <>
                        <HelpConnectModal 
                            closeModal={()=>setShowModal(false)}
                        />
                    </>
                ) : null}
            </div>
            <div className='grid grid-cols-3 gap-2'>
                {USERS.map((user, index:any) => (
                    <ReecherProfileCard 
                        key={index}
                        onClick={()=>
                            selected.includes(index) 
                            ?
                                // selected.splice(selected.indexOf(index), 1)
                                // selected.filter(item => item !== index)
                                // alert('remove')
                                delete selected[index]
                            :
                                setSelected([...selected, index])

                        } 
                        selected={selected.includes(index)}
                        name={user.name}
                        location={user.location}
                        duration={user.duration}
                        education={user.education}
                        avatar={user.avatar}
                    />
                ))}
            </div>
        </div>
    );
};

export default SeeWhosBeenReeched;