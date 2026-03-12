import styles from './Modal.module.css';

import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
	children: React.ReactNode;
	closeModal: () => void;
}

const Modal = ({ children, closeModal }: ModalProps) =>
	ReactDOM.createPortal(
		<div className={styles.modalWrap} onClick={closeModal}>
			<div className={styles.modal} onClick={e => e.stopPropagation()}>
				{children}
			</div>
		</div>,
		document.querySelector('#modals')!
	);

export default Modal;
