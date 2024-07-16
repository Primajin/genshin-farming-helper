/* global window */
export const isPRPreview = () => {
	const {pathname} = window?.location ?? {pathname: {includes: () => false}};
	return pathname.includes('/pr-preview');
};
