module.exports = {
    title: 'Documents',
    description: '开发运维技术文档',
    dest: './dist',
    port: '52225',
	base: '/documents/',
    head: [
		['meta', { name: 'keywords', content: 'Chinaguocg,Documents,DevOps,IT技术,文档博客,开发,运维,技术文档' }],
        ['link', {rel: 'icon', href: '/img/logo.png'}],
		['link', {rel: 'stylesheet', href: '/css/style.css'}]
    ],
    markdown: {
        lineNumbers: true
    },
	locales: {
		'/': {
		  lang: 'zh-CN'
		}
	},
    themeConfig: {
        nav: require("./nav.js"),
        sidebar: require("./sidebar.js")
    },
    plugins: [
        '@vuepress/back-to-top',
        '@vuepress/medium-zoom'
    ]
}