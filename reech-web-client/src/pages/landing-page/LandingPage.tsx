import AvatarBox from '@/components/ui/AvatarBox';
import UserListCard from '@/components/ui/UserListCard';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const USERS = [
    {
        name: 'Lauren Jacobs',
        title: 'Finance',
        avatar: 'avatar-08.jpg'
    },
    {
        name: 'Anele Jabane',
        title: 'Human Resources',
        avatar: 'avatar-02.jpg'
    },
    {
        name: 'Thabo Moyo',
        title: 'Marketing',
        avatar: 'avatar-01.jpg'
    },
    {
        name: 'Angela Dlamini',
        title: 'Sales',
        avatar: 'avatar-07.jpg'
    },
]

const LandingPage = () => {
    const [selected, setSelected] = useState('');
    
    
      return (
        <div 
          className='flex min-h-screen items-center justify-center py-5 px-4 sm:px-6 lg:px-8'
          style={{
            backgroundImage: `url('/media/misc/Coca-cola.jpg')`,
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* begin::Body */}
          <div className='flex flex-col'>
            <div className='lg:min-w-[600px] h-[80vh] overflow-scroll backdrop-blur-lg rounded-lg border border-white/30'>
              <div className='flex flex-col justify-between py-10 px-11 h-full'>

                <div>
                    <div>
                        <div className='flex justify-center'>
                            <div className='w-16'>
                                <img 
                                    src="/media/misc/coca-cola.png" 
                                    alt='logo'
                                    className='object-cover drop-shadow-sm'
                                />
                            </div>
                            <h4>, welcome <span className='font-semibold'>Coca Cola</span> to the world of reeching!</h4>
                        </div>
                        <div className='mt-7 mb-2 text-center'>Who is reeching today?</div>
                    </div>
                </div>

                <div className='mb-7 h-[72%] flex flex-col justify-center overflow-scroll rounded'>
                    {USERS.map((user, index) => (
                        <UserListCard 
                            onClick={()=>setSelected(`${index}`)} 
                            selected={selected === `${index}`}
                            name={user.name}
                            title={user.title}
                            avatar={user.avatar}
                        />
                    ))}
                </div>

                

                <div className='flex flex-col justify-center'>
                    <Link to='/home'>
                        <div className='w-full flex justify-center py-3 bg-purple-500 rounded text-white bottom-0'>
                            Continue
                        </div>
                    </Link>

                    <span className='text-center text-white text-sm'>
                        Not a reecher yet? 
                        <Link to='/auth/registration' className='ml-1 text-purple-300'>
                             Register here.
                        </Link>
                    </span>
                </div>
                

              </div>
            </div>
          </div>
          {/* end::Body */}
          <div className='w-64 absolute top-0 right-0 p-3'>
            <img 
                src="/media/logos/logo-white.png" 
                alt='logo'
                className='object-cover drop-shadow-sm'
            />
        </div>
        </div>
      )
};

export default LandingPage;