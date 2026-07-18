import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Note from '@/components/ui/Note';
import NoteTracker from '@/components/ui/NoteTracker';
import React from 'react';

const ViewMyNotes = () => {
    return (
        <div className='flex mt-5'>
            <Card className='basis-1/3 border py-3 px-2 rounded-lg'>
                <h4 className='font-bold text-slate-500 text-xl mb-4'>My Quick Thoughts</h4>

                <select className='bg-gray-50 border border-gray-300 rounded w-full mb-3'>
                    <option selected>Junior Bookkeeper</option>
                    <option>Senior Arctuary</option>
                    <option>Engineer</option>
                    <option>Marketer</option>
                </select>

                <select className='bg-gray-50 border border-gray-300 rounded w-full'>
                    <option selected>Bongi Thwalo</option>
                    <option>Phuleng Khumalo</option>
                </select>

                <div className='w-full flex justify-center py-5'>
                    <Avatar className='h-32' />
                </div>
            </Card>
            
            <Card className='basis-2/3 ml-2'>
                <h4 className='font-bold text-slate-500 text-xl mb-4'>View My Notes</h4>

                <div className="flex gap-3 mb-4">
                    <div className="basis-2/3">
                        <select className='bg-purple-500 text-white border-none rounded w-full mb-3'>
                            <option selected>My Filters</option>
                            <option>In the last week</option>
                        </select>

                        <Button
                            variant='custom'
                            size='small'
                            className='bg-gray-200 text-slate-500 font-normal text-sm px-8'
                        >
                            In the last week
                            <i className="ml-3 fa-solid fa-xmark text-purple-500"></i>
                        </Button>
                    </div>

                    <NoteTracker />
                </div>

                

                <div className="flex p-4 border border-slate-400 rounded-lg mb-3">
                    <div className="basis-1/4 flex items-center">
                        <span className='text-xl font-bold text-slate-400'>Priority Notes</span>
                    </div>

                    <div className="basis-3/4 grid gap-4 grid-cols-3">
                        <Note color='bg-lime-300' date='01.01.23' message='Call with HR Director' />
                        <Note color='bg-fuchsia-300' date='01.01.23' message='New Production Manager' />
                        <Note color='bg-green-300' date='01.01.23' message="Planning Thabo's farewell party" />
                    </div>
                </div>


                <div className="flex bg- p-4 border border-slate-400 rounded-lg">
                    <div className="basis-1/4 flex items-center">
                        <span className='text-xl font-bold text-slate-400'>Random Notes</span>
                    </div>

                    <div className="basis-3/4 grid gap-4 grid-cols-3">
                        <Note color='bg-yellow-300' date='01.01.23' message='The #SpazaShopCokeSpecial campaign' />
                    </div>
                </div>

            </Card>
        </div>
    );
};

export default ViewMyNotes;