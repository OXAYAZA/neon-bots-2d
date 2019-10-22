module.exports = {
	livedemo: {
		enable:      true,
		server:      {
			baseDir:   `dev/`,
			directory: false
		},
		port:        8000,
		open:        false,
		notify:      true,
		reloadDelay: 0,
		ghostMode:   {
			clicks: false,
			forms:  false,
			scroll: false
		}
	},
	watcher:  {
		enable: true,
		watch:  [
			`dev/**/*.js`,
			`dev/**/*.html`,
			`dev/**/*.css`
		]
	}
};
