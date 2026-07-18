import React from 'react';
import Avatar from '../../ui/Avatar';
import Card from '../../ui/Card';
import MessageItem from './components/MessageItem';


const MyConversations = () => {
    return (
        <div className='h-1/2'>
            <Card className='h-full overflow-scroll'>
                <h4 className='text-lg mb-3'>My Conversations</h4>
                <MessageItem username='Francis' last_message='Hi, how are you doing?' avatar='avatar-04.jpg' />
                <MessageItem username='Sam' last_message='I sent you the files.' avatar='avatar-05.jpg' />
                <MessageItem username='Angela' last_message='Hello there!' avatar='avatar-07.jpg' />
                <MessageItem username='Thabo' last_message='Hello there!' avatar='avatar-01.jpg' />
            </Card>
        </div>
    );
};

export default MyConversations;