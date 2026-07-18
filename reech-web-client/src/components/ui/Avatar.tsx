import clsx from 'clsx';
import React from 'react';

interface Props {
    className?: string
    avatar?: string
}

const Avatar: React.FC<Props> = ({className, avatar}) => {
    return (
        <div>
            <img
                className={clsx('rounded-full h-16', className)}
                src={avatar ? `/media/avatars/${avatar}` : `/media/avatars/avatar-01.jpg`}
                alt="" 
            />
        </div>
    );
};

export default Avatar;