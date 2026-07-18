import { checkIsActive } from '@/lib';
import clsx from 'clsx';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Props {
    to: string
    title: string
}

const MenuHorizontal:React.FC<Props> = ({to, title}) => {
    const location = useLocation()
    const {pathname} = useLocation()
    const isActive = checkIsActive(pathname, to)
    
    return (
        <li className='flex justify-items-stretch p-0'>
            <Link
                className={clsx(`pb-3 mr-6`, {
                    'border-b-4 border-purple-500 text-purple-500': isActive
                })}
                to={to}
            >
                {title}
            </Link>
        </li>
    );
};

export default MenuHorizontal;