import OpportunityCard from '@/components/cards/OpportunityCard';
import Card from '@/components/ui/Card';
import { DonutChart } from '@/components/widgets/charts/DonutChart';
import { Opps } from '@/rest-api/fake-data/fake-data';
import React from 'react';

const MyReech = () => {

    const opps = Opps;
    return (
        <div className='flex flex-col'>
            <h4 className='text-2xl mb-4'>My Reech For: New Hires</h4>
            <div className='flex flex-row gap-2'>
                <div className='basis-1/4'>
                    <Card>
                        <h4 className='text-6xl text-slate-600 font-bold'>6</h4>
                        <span className='text-slate-400 absolute'>Current Posts</span>
                        <DonutChart chartHeight='' chartTitle='' className='top-0'/>
                    </Card>
                </div>
                <div className='basis-3/4'>
                    <Card className='grid grid-cols-3 p-10 gap-5'>
                        {opps.map((opp, index) => (
                            <OpportunityCard 
                                key={index}
                                id={opp.id}
                                image={opp.image}
                                title={opp.title} 
                                salary={opp.salary}
                                views={opp.views} 
                                date_posted={opp.date_posted}
                            />
                        ))}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MyReech;