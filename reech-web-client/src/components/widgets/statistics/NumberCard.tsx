import Card from '@/components/ui/Card';
import clsx from 'clsx';
import React from 'react';

interface Props {
    className?: any
    applications?: string
}

const NumberCard: React.FC<Props> = ({className, applications}) => {
    return (
        <Card 
            className={clsx("bg-gradient-to-br from-green-500 to-black flex flex-col justify-between text-white w-full",
                        className
                    )}>
            <h4>Applications</h4>
            <h2 className='text-[60px] font-bold text-center my-4'>{applications ? applications : "1,876"}</h2>
            <div className='text-sm'>
                <span>Last 7 days: 1,876</span><br />
                <span>Average per day: 93</span>
            </div>
        </Card>
    );
};

export default NumberCard;