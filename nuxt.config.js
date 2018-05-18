module.exports = {
	/*
	** Headers of the page
	*/
	mode: 'spa',
	router: {
		middleware: ['check-auth', 'navigation']
	},
	head: {
		title: 'Dofuu website',
		meta: [
		{ charset: 'utf-8' },
		{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		{ hid: 'description', name: 'description', content: 'Dofuu website' }
		],
		link: [
		{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
		{ rel: 'icon', type: 'image/x-icon', href: '/icon-store.png' },
		{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'}
		]
	},
	/*
	** Customize the progress bar color
	*/
	loading: { color: '#3B8070' },
	css: [{src: 'vuetify/dist/vuetify.min.css', lang: 'css'}],
	/*
	** Build configuration
	*/
	plugins: ['~/plugins/vuetify', '~/plugins/filters', '~/plugins/vee-validate' , '~/plugins/axios', '~/plugins/numeral', '~/plugins/vue-google-map'],
	/*
	** Build configuration
	*/
	build: {
		vendor: ['vuetify', 'axios', 'js-cookie', 'moment', 'vee-validate', 'numeral', 'vue2-google-maps'],
	/*
	** Run ESLint on save
	*/
	extend(config, { isDev, isClient }) {
		if (isDev && isClient) {
			// config.module.rules.push({
			//   enforce: 'pre',
			//   test: /\.(js|vue)$/,
			//   loader: 'eslint-loader',
			//   exclude: /(node_modules)/
			// })
		}
		if(!isClient) {
			config.externals.splice(0, 0, function (context, request, callback) {
				if (/^vue2-google-maps($|\/)/.test(request)) {
					callback(null, false)
				} else {
					callback()
				}
			})
		}
	}
}

}
