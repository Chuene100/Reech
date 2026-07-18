import clsx from 'clsx';
import React from 'react';

interface Props {
    className?: string
    avatar?: string
}

const AvatarBox: React.FC<Props> = ({className, avatar}) => {
    return (
        <div>
            <img
                className={clsx('rounded-xl', className)}
                src={avatar ? `/media/avatars/${avatar}` : `/media/avatars/avatar-02.jpg`}
                alt="" 
                style={{maxWidth: '10vw', margin: '4px'}}
            />
        </div>
    );
};

export default AvatarBox;