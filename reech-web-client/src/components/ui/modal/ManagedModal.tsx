import { lazy } from 'react';
import Modal from './Modal';
import { useModalAction, useModalState } from './Modal.Context';


const ReechFor = lazy(() => import('@/components/ui/modal/modals/ReechForModal'));

const ManagedModal = () => {
  const { isOpen, view, data } = useModalState();
  const { closeModal } = useModalAction();

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {view === 'REECH_FOR' && <ReechFor />}
    </Modal>
  );
};

export default ManagedModal;
