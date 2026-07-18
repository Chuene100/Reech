import Avatar from '@/components/ui/Avatar';
import React from 'react';

interface Props {
    username: string
    last_message: string
    avatar?: string
}
const MessageItem: React.FC<Props> = ({username, last_message, avatar}) => {
    return (
        <>
            <div className='flex gap-4'>
                <Avatar avatar={avatar}/>
                <div className='flex flex-col justify-center'>
                    <h6 className='font-[600] text-[16px]'>{username}</h6>
                    <p className='text-slate-400 font-[400] text-sm'>{last_message}</p>
                </div>
            </div>
            <div className='w-full h-[1px] bg-gray-300 my-3'></div>
        </>
    );
};

export default MessageItem;