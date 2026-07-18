import clsx from 'clsx';
import React from 'react';

interface Props {
    text: string
    time: string
    color?: string
}

const NoteItem: React.FC<Props> = ({text, time, color}) => {
    return (
        <div className='flex justify-start relative text-sm mb-3 pt-3'>
            <div className='w-14 flex-shrink-0 relative'>{time}</div>
            <div className='flex-shrink-0 w-4 h-4 rounded-full flex content-center items-center relative z-10 -ml-2 mt-[3px] bg-white'>
                <i className={clsx('fa fa-genderless text-2xl', color, {
                    'text-gray-500': !color
                })}></i>
            </div>
            <div className='flex flex-grow text-slate-500 pl-3'>
                {text}
            </div>
    </div>
    );
};

export default NoteItem;