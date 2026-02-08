/** @jsxImportSource @emotion/react */
/* global document */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';
import {useEffect} from 'react';
import theme from 'theme';

const overlay = css`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.7);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	padding: 20px;
`;

const modal = css`
	background: ${theme.primary};
	border-radius: 12px;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
	max-width: 600px;
	width: 100%;
	max-height: 90vh;
	display: flex;
	flex-direction: column;
	position: relative;
`;

const header = css`
	padding: 20px 20px 10px;
	border-bottom: 2px solid rgba(0, 0, 0, 0.2);
	display: flex;
	justify-content: space-between;
	align-items: center;
	
	h2 {
		margin: 0;
		color: ${theme.text};
		font-size: 24px;
		font-weight: 700;
	}
`;

const closeButton = css`
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${theme.text};
	font-size: 28px;
	line-height: 1;
	transition: transform 0.2s ease;
	
	&:hover {
		transform: scale(1.2);
	}
`;

const content = css`
	flex: 1;
	overflow-y: auto;
	padding: 0;
`;

function ModalDialog({isOpen, onClose, title, children = null}) {
	useEffect(() => {
		const bodyOverflow = isOpen ? 'hidden' : '';
		document.body.style.overflow = bodyOverflow;

		// Cleanup
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	const handleOverlayClick = event => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	};

	return (
		<div css={overlay} onClick={handleOverlayClick}>
			<div css={modal} role='dialog' aria-modal='true' aria-labelledby='modal-title'>
				<div css={header}>
					<h2 id='modal-title'>{title}</h2>
					<button
						css={closeButton}
						type='button'
						aria-label='Close modal'
						onClick={onClose}
					>
						×
					</button>
				</div>
				<div css={content}>
					{children}
				</div>
			</div>
		</div>
	);
}

ModalDialog.propTypes = {
	children: PropTypes.node,
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
};

export default ModalDialog;
