module.exports = {
	getHome(req, res) {
		res.render('homepage', { title: 'Welcome to blogPost' });
	},
	getAbout(req, res) {
		res.render('about', { title: 'About Us' });
	}
};
