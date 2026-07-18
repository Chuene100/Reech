import React from 'react';
import AvatarBox from '../ui/AvatarBox';
import clsx from 'clsx';

interface Props {
    option?: any
    selected?: any
    onClick?: any
    name?: string
    location?: string
    duration?: string
    education?: string
    avatar?: string
    className?: string
}

const ReecherProfileCard:React.FC<Props> = ({option, selected, onClick, name, location, education, duration, avatar, className}) => {
    return (
        <div 
            onClick={() => onClick()}
            className={clsx('flex gap-2 mb-2 hover:bg-purple-500 hover:text-white rounded-xl p-1 cursor-pointer',
            {
                'bg-purple-500 text-white': selected,
                'bg-purple-100': !selected,
            }, className
            )}
        >
            <AvatarBox avatar={avatar} className=' w-32'/>
            <div className='w-full'>
                <div className='w-full flex justify-between'>
                    <h5 className='text-xl mb-1'>{name}</h5>
                    
                    {selected ? 
                    <i className="fa-solid fa-circle-check"></i>
                    :
                    <i className="fa-regular fa-circle"></i>
                }
                </div>
                <div className='text-sm text-slate-500'>
                    <span><i className="iconly-Location icbo mr-3"></i>{location}</span><br />
                    <span><i className="iconly-Time-Circle icbo mr-3"></i>{duration}</span><br />
                    <span><i className="iconly-Paper icbo mr-3"></i>{education}</span><br />
                </div>
            </div>
        </div>
    );
};

export default ReecherProfileCard;