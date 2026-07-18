import React from 'react';

interface Props {
    closeModal?: any
}
const CloseModal: React.FC<Props> = ({closeModal}) => {
    return (
        <button
            className="p-1 ml-auto bg-transparent border-0 text-red-500 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={closeModal}
        >
            <i className="iconly-Close-Square icbo"></i>
        </button>
    );
};

export default CloseModal;