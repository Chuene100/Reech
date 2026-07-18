import React from 'react';

const NoteTracker = () => {
    return (
        <div className="bg-gray-100 rounded-lg p-2 basis-1/3 flex flex-col gap-2">
            <span>Note Tracker</span>

            <div className="flex">
                <div className="bg-lime-300 basis-1/4 rounded mr-3"></div>
                <div className="basis-3/4">Calls</div>
            </div>

            <div className="flex">
                <div className="bg-fuchsia-300 basis-1/4 rounded mr-3"></div>
                <div className="basis-3/4">Role Requirements</div>
            </div>

            <div className="flex">
                <div className="bg-green-300 basis-1/4 rounded mr-3"></div>
                <div className="basis-3/4">Plans</div>
            </div>

            <div className="flex">
                <div className="bg-yellow-300 basis-1/4 rounded mr-3"></div>
                <div className="basis-3/4">Other</div>
            </div>
        </div>
    );
};

export default NoteTracker;