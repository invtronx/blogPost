const validator = require('express-validator');
		
const AuthUser = require('../models/authUser');
const Blogger = require('../models/blogger');

const helper = require('./helper');

module.exports = {
	getSignup(req, res) {
		res.render('signup', { title: 'blogPost: Signup' });
	},
	postSignup: [
		helper.checkUsername,
		helper.checkPassword,
		helper.checkPasswordConfirmation,
		(req, res, next) => {
			const validationErrors = validator.validationResult(req);
			const { username: s_username, password: s_password } = req.body;
			// Re-render the form if errors exist
			if (!validationErrors.isEmpty()) 
				res.render('signup', { title: 'blogPost: Signup', errors: validationErrors.array() });
			else {
				const newUser = new AuthUser({ username: s_username });
				const newBlogger = new Blogger({ user: newUser._id });

				newUser.setPassword = s_password;
				newUser.blogger = newBlogger._id;

				newBlogger.username = '@' + s_username;

				newBlogger.save(function(err) {
					if (err) return next(err);
					return true;
				});
				
				newUser.save(function(err) {
					if (err) return next(err);
					req.session.userId = newUser._id;
					res.redirect('/blogger/fill/' + newBlogger._id);
				});
			}
		}
	],
	getLogin(req, res) {
		res.render('login', { title: 'blogPost: Login' });
	}, 
	postLogin: [
		helper.isExistingUsername,
		helper.passwordMatches,
		validator.body('username').escape(),
		validator.body('password').escape(),
		async (req, res, next) => {
			// Re-render if validation errors exist
			const validationErrors = validator.validationResult(req);
			if (!validationErrors.isEmpty()) 
				res.render('login', { title: 'blogPost: Login', errors: validationErrors.array() });
			else {
				const existingUser = await AuthUser.findOne({ username: req.body.username }).exec();
				req.session.userId = existingUser._id;
				res.redirect('/blog/blogfeed');
			}
		}
	],
	async getLogout(req, res) {
		const blogger = await Blogger.findOne({ user: req.session.userId }).exec();
		res.render('logout', {
			title: 'blogPost: Logout',
			blogger: blogger
		});
	},
	postLogout(req, res) {
		req.session.userId = null;
		res.redirect('/home');
	}
};






















