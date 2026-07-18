import React from 'react';
import Card from '../../ui/Card';
import { SVG } from '@/lib';
import NoteItem from './components/NoteItem';

interface Props {
    className?: string;
}

const MyNotes:React.FC<Props> = ({className}) => {
    return (
        <Card>
            <div className={`card ${className}`}>
                <div className='card-header align-items-center border-0 mt-4'>
                    <h3 className='card-title align-items-start flex-column'>
                        <span className='mb-2 text-lg'>My Notes</span>
                    </h3>
                </div>

                <div className='card-body pt-5'>
                    <div className='relative before:absolute before:content-[""] before:top-0 before:bottom-0 before:w-[2px] before:ml-[56px] before:bg-gray-200'>
                        <NoteItem time='08:42' text='Call with HR Director.' color='text-purple-500'/>
                        <NoteItem time='10:00' text='Zoom interview with Danai.' color='text-green-500' />
                        <NoteItem time='13:40' text='Board meeting!' color='text-orange-500' />
                        <NoteItem time='23/04' text="Plan Thabo's farewell" color='text-blue-400' />
                        <NoteItem time='01/05' text='Interns induction.' color='text-red-500' />
                    </div>
                </div>
                </div>
        </Card>
    );
};

export default MyNotes;