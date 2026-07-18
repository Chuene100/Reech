import React, { useState } from 'react';
import AvatarBox from './AvatarBox';
import clsx from 'clsx';

interface Props {
    option?: any
    selected?: any
    onClick?: any
    name: string
    title: string
    avatar?: string
}

const UserListCard: React.FC<Props> = ({option, selected, onClick, name, title, avatar}) => {
    return (
        <div 
            onClick={() => onClick()}
            className={clsx('flex gap-2 mb-2 bg-white hover:bg-purple-500 hover:text-white rounded-xl p-1 cursor-pointer',
            {
                'bg-purple-500 text-white': selected
            }
            )}
        >
            <AvatarBox avatar={avatar} className='h-16' />
            <div>
                <h5 className='text-xl -mb-1'>{name}</h5>
                <span className='text-sm opacity-75'>{title}</span>
            </div>
        </div>
    );
};

export default UserListCard;