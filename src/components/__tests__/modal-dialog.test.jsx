/* global document */
import {fireEvent, render, screen} from '@testing-library/react';
import {
	describe, expect, test, vi,
} from 'vitest';
import ModalDialog from 'components/organisms/modal-dialog.jsx';

describe('modalDialog', () => {
	test('renders nothing when closed', () => {
		render(<ModalDialog isOpen={false} title='Test' onClose={vi.fn()}/>);
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	test('renders dialog when open', () => {
		render(<ModalDialog isOpen title='Test Modal' onClose={vi.fn()}/>);
		expect(screen.getByRole('dialog')).toBeDefined();
		expect(screen.getByText('Test Modal')).toBeDefined();
	});

	test('sets body overflow to hidden when open', () => {
		render(<ModalDialog isOpen title='Test' onClose={vi.fn()}/>);
		expect(document.body.style.overflow).toBe('hidden');
	});

	test('restores body overflow on unmount', () => {
		const {unmount} = render(<ModalDialog isOpen title='Test' onClose={vi.fn()}/>);
		expect(document.body.style.overflow).toBe('hidden');
		unmount();
		expect(document.body.style.overflow).toBe('');
	});

	test('calls onClose when close button is clicked', () => {
		const handleClose = vi.fn();
		render(<ModalDialog isOpen title='Test' onClose={handleClose}/>);
		fireEvent.click(screen.getByLabelText('Close modal'));
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	test('calls onClose when overlay is clicked', () => {
		const handleClose = vi.fn();
		const {container} = render(<ModalDialog isOpen title='Test' onClose={handleClose}/>);
		// The overlay is the outermost div
		const overlayElement = container.firstChild;
		fireEvent.click(overlayElement);
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	test('does not call onClose when modal content is clicked', () => {
		const handleClose = vi.fn();
		render(<ModalDialog isOpen title='Test' onClose={handleClose}/>);
		fireEvent.click(screen.getByRole('dialog'));
		expect(handleClose).not.toHaveBeenCalled();
	});

	test('renders children inside the dialog', () => {
		render(<ModalDialog isOpen title='Test' onClose={vi.fn()}><p>Child content</p></ModalDialog>);
		expect(screen.getByText('Child content')).toBeDefined();
	});

	test('has correct aria attributes', () => {
		render(<ModalDialog isOpen title='Test Modal' onClose={vi.fn()}/>);
		const dialog = screen.getByRole('dialog');
		expect(dialog.getAttribute('aria-modal')).toBe('true');
		expect(dialog.getAttribute('aria-labelledby')).toBe('modal-title');
		expect(screen.getByText('Test Modal').id).toBe('modal-title');
	});
});
