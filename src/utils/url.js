export const isPRPreview = () => {
	const {pathname} = globalThis?.location ?? {pathname: {includes: () => false}};
	return pathname.includes('/pr-preview');
};
