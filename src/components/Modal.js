import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const Modal = ({ children, closeModal }) => (
	ReactDOM.createPortal(
		<div className="modal-wrap" onClick={closeModal}>
			<div className="modal" onClick={e => e.stopPropagation()}>
				{children}
			</div>
		</div>,
		document.querySelector('#modals')
	)
);

Modal.propTypes = {
	children: PropTypes.node.isRequired,
	closeModal: PropTypes.func.isRequired
};

export default Modal;
