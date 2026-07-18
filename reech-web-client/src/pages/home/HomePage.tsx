import HelloCard from '@/components/cards/HelloCard';
import OpportunityCard from '@/components/cards/OpportunityCard';
import Card from '@/components/ui/Card';
import MyConversations from '@/components/widgets/MyConversations/MyConversations';
import MyNotes from '@/components/widgets/notes/MyNotes';
import { Opps } from '@/rest-api/fake-data/fake-data';
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const opps = Opps;

    return (
        <div className='container flex h-full'>
            <div className='basis-2/3'>
                <HelloCard className='h-[60%] flex flex-row items-center'/>

                <div className='mt-2'>
                    <Card>
                        <h4 className='text-lg mb-3'>Featured Cards</h4>
                        <div className="flex">
                            <div className='flex flex-row gap-5'>
                                {opps.slice(0,3).map((opp, index) => (
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
                                <Link
                                    to='/opportunity' 
                                    className='flex items-center text-slate-500'
                                >
                                    <span className='mr-3'>View All</span>
                                    <i className="iconly-Arrow-Right-Circle text-4xl"></i>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <div className='basis-1/3 pl-2'>
                <MyConversations />

                <div className='mt-2'>
                    <MyNotes />
                </div>
            </div>
        </div>
    );
};

export default HomePage;