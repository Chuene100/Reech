import clsx from 'clsx';
import React from 'react';

interface Props {
    color: string
    date: string
    message: string
}

const Note: React.FC<Props> = ({color, date, message}) => {
    return (
        <div className={clsx('h-32 p-2 rounded', color)}>
            <p className='font-semibold mb-2'>{date}</p>
            <p>{message}</p>
        </div>
    );
};

export default Note;