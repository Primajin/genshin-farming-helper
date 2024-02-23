/* global window */
export const isPRPreview = () => {
	const {pathname} = window?.location ?? {};
	return pathname.includes('/pr-preview');
};
