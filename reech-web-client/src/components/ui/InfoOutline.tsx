import React from 'react';

interface Props {
    title: string
    subtitle: string
}

const InfoOutline: React.FC<Props> = ({title, subtitle}) => {
    return (
        <div className='border border-gray-300  rounded min-w-125px py-1 px-10 mr-6 mb-2'>
            <div className='flex items-center justify-center'>
                <div className='font-bold '>{title}</div>
            </div>

            <div className='text-sm text-gray-400 flex justify-center'>{subtitle}</div>
        </div>
    );
};

export default InfoOutline;