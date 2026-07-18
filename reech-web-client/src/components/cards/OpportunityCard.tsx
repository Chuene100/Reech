import { toAbsoluteUrl } from '@/lib';
import React from 'react';
import Card from '../ui/Card';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface Props {
    id?: number,
    title: string,
    salary: string
    views: string
    date_posted: string
    image?: string
    className?:string
}

const OpportunityCard: React.FC<Props> = ({id, title, salary, views, date_posted, image, className}) => {
    return (
        <Card
            style={{
                backgroundImage: `url(${image ? toAbsoluteUrl(`${image}`) : toAbsoluteUrl('/media/avatars/avatar-01.jpg')})`,
                backgroundSize: 'cover',
                padding: '0px',
                boxShadow: '10px 10px 5px grey',
                position: 'relative'
            }}
            className={clsx(`lg:w-[250px] lg:h-[200px] text-white`, className)}
        >
            <Link to={`/opportunity/${id}`} className='h-full flex flex-col justify-end rounded-lg bg-gradient-to-b to-black/80'>
                <div className='flex flex-row h-20'>
                    <div
                        style={{
                            width: '50%',
                            background: 'linear-gradient(to left, rgba(158, 105, 201, 1), rgba(158, 105, 201, 0))',
                            padding: '4px'
                        }}
                    ></div>
                    <div
                        style={{
                            width: '50%',
                            background: 'linear-gradient(to right, rgba(158, 105, 201, 1), rgba(158, 105, 201, 0))',
                            padding: '4px'
                        }}
                    ></div>
                </div>
                <div
                    style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0)',
                        padding: '4px',
                        position: 'absolute',
                        bottom: 0,
                        left: 0
                    }}
                >
                    <div className='mb-3 gap-0 leading-tight'
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        <span className='text-md' 
                            style={{
                               fontFamily: 'sans-serif',
                               fontWeight: '700',
                               fontSize: '18px'
                            }}
                        >
                            {title}
                        </span>
                        <br />
                        <span className='text-sm m-0' 
                            style={{
                                fontFamily: 'sans-serif'
                            }}
                        >
                            {salary}
                        </span>
                    </div>
                    <div className="flex"
                        style={{
                        textAlign: 'center',
                        marginTop: '-5%'
                        }}
                    >
                        <div className='basis-1/2'>
                            <span className='text-sm mr-5'>  
                                <i className="iconly-Show h-full my-auto"></i>
                                {" " + views}
                            </span>
                        </div>
                        <div className='basis-1/2' 
                            style={{
                                textAlign: 'center'
                            }}
                        > 
                            <span className='text-sm'>   
                                <i className="iconly-Time-Circle b my-auto"></i>
                                {" " + date_posted}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </Card>
    );
};

export default OpportunityCard;