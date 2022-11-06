module.exports = {
	siteMetadata: {
		title: 'Genshin Farming Helper',
		siteUrl: 'https://www.yourdomain.tld',
	},
	plugins: ['gatsby-plugin-emotion', 'gatsby-plugin-image', {
		resolve: 'gatsby-plugin-manifest',
		options: {
			icon: 'src/images/icon.png',
		},
	}, 'gatsby-plugin-sharp', 'gatsby-transformer-sharp', {
		resolve: 'gatsby-source-filesystem',
		options: {
			name: 'images',
			path: './src/images/',
		},
		__key: 'images',
	}],
};
