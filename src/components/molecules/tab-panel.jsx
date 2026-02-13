/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';
import theme from 'theme';

const tabList = css`
	display: flex;
	border-bottom: 2px solid rgba(0, 0, 0, 0.3);
	margin: 0;
	padding: 0;
	list-style: none;
`;

const tabButton = css`
	flex: 1;
	padding: 12px 20px;
	background: ${theme.secondary};
	border: none;
	border-bottom: 3px solid transparent;
	cursor: pointer;
	font-size: 14px;
	font-weight: 600;
	color: ${theme.text};
	transition: all 0.2s ease;
	
	&:hover {
		background: ${theme.primary};
	}
	
	&.active {
		background: ${theme.primary};
		border-bottom-color: ${theme.accent};
	}
`;

const tabContent = css`
	padding: 0;
`;

function TabPanel({tabs, activeTab, onTabChange, children = null}) {
	return (
		<div>
			<ul css={tabList} role='tablist'>
				{tabs.map(tab => (
					<li key={tab.id} role='presentation'>
						<button
							css={tabButton}
							className={activeTab === tab.id ? 'active' : ''}
							role='tab'
							type='button'
							aria-selected={activeTab === tab.id}
							onClick={() => onTabChange(tab.id)}
						>
							{tab.label}
						</button>
					</li>
				))}
			</ul>
			<div css={tabContent} role='tabpanel'>
				{children}
			</div>
		</div>
	);
}

TabPanel.propTypes = {
	activeTab: PropTypes.string.isRequired,
	children: PropTypes.node,
	onTabChange: PropTypes.func.isRequired,
	tabs: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	})).isRequired,
};

export default TabPanel;
