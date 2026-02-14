import {fireEvent, render, screen} from '@testing-library/react';
import {
	describe, expect, test, vi,
} from 'vitest';
import TabPanel from 'components/molecules/tab-panel.jsx';

const tabs = [
	{id: 'tab1', label: 'First Tab'},
	{id: 'tab2', label: 'Second Tab'},
	{id: 'tab3', label: 'Third Tab'},
];

describe('tabPanel', () => {
	test('renders all tab buttons', () => {
		render(<TabPanel activeTab='tab1' tabs={tabs} onTabChange={vi.fn()}/>);
		expect(screen.getByText('First Tab')).toBeDefined();
		expect(screen.getByText('Second Tab')).toBeDefined();
		expect(screen.getByText('Third Tab')).toBeDefined();
	});

	test('marks active tab with aria-selected and active class', () => {
		render(<TabPanel activeTab='tab2' tabs={tabs} onTabChange={vi.fn()}/>);
		const activeButton = screen.getByText('Second Tab');
		expect(activeButton.getAttribute('aria-selected')).toBe('true');
		expect(activeButton.classList.contains('active')).toBe(true);

		const inactiveButton = screen.getByText('First Tab');
		expect(inactiveButton.getAttribute('aria-selected')).toBe('false');
		expect(inactiveButton.classList.contains('active')).toBe(false);
	});

	test('calls onTabChange with tab id when clicked', () => {
		const handleChange = vi.fn();
		render(<TabPanel activeTab='tab1' tabs={tabs} onTabChange={handleChange}/>);
		fireEvent.click(screen.getByText('Second Tab'));
		expect(handleChange).toHaveBeenCalledWith('tab2');
	});

	test('renders children in the tabpanel area', () => {
		render(<TabPanel activeTab='tab1' tabs={tabs} onTabChange={vi.fn()}><div>Panel content</div></TabPanel>);
		expect(screen.getByText('Panel content')).toBeDefined();
		expect(screen.getByRole('tabpanel')).toBeDefined();
	});

	test('has correct ARIA roles', () => {
		render(<TabPanel activeTab='tab1' tabs={tabs} onTabChange={vi.fn()}/>);
		expect(screen.getByRole('tablist')).toBeDefined();
		const tabButtons = screen.getAllByRole('tab');
		expect(tabButtons).toHaveLength(3);
	});

	test('renders without children', () => {
		render(<TabPanel activeTab='tab1' tabs={tabs} onTabChange={vi.fn()}/>);
		const tabpanel = screen.getByRole('tabpanel');
		expect(tabpanel).toBeDefined();
	});
});
