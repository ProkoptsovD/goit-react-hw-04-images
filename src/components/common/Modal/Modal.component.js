import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { modalPortal } from 'portals';
import { Overlay, ModalWindow } from './Modal.styled';

const Modal = ({ closeModal, imageURL }) => {

    useEffect(() => {
        document.addEventListener('keydown', closeModal);

        return () => document.removeEventListener('keydown', closeModal);
    }, [closeModal]);

    return (
        modalPortal(
            <Overlay
                onClick={closeModal}
            >
                <ModalWindow>
                    <img src={imageURL} alt="pixabay" />
                </ModalWindow>
            </Overlay>
        )
    )
}

Modal.propTypes = {
    imageURL: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired
}

export default Modal;