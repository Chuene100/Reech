import React from 'react';
import Card from '../ui/Card';
import { toAbsoluteUrl } from '@/lib';


interface Props {
    title:string
    image?: string
}
const ReechForCard: React.FC<Props> = ({title, image}) => {
    return (
        <Card
            style={{
                backgroundImage: `url(${toAbsoluteUrl(`${image}`)})`,
                backgroundSize: 'cover',
                padding: '0px',
            }}
            className='w-64 h-80 text-white cursor-pointer'
        >
            <div className='h-full flex flex-col justify-end rounded-lg p-4 bg-gradient-to-b from-fuchsia-700/70 hover:from-white/0 to-black/80 '>
                <div className='h-full flex flex-col justify-end after:relative after:w-4  after:border-b 
                after:border-l transition-all  hover:after:w-full 
                after:transition-all after:duration-300 after:ease-in-out'>
                    <h4 className='text-lg'>{title}</h4>
                </div>
            </div>
        </Card>
    );
};

export default ReechForCard;