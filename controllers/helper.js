const validator = require('express-validator');
const mongoose = require('mongoose');

const AuthUser = require('../models/authUser');
const Blog = require('../models/blog');
const Notification = require('../models/notification');
const Blogger = require('../models/blogger');

mongoose.set('useFindAndModify', false);

module.exports = {
	// Validate and Sanitize: Username
	checkUsername: validator.body('username')
		.trim()
		.isLength({ min: 8, max: 18 }).withMessage('Username must be between 8 and 18 characters.')
		.custom(async (username) => {
			const existingUser = await AuthUser.findOne({ 'username': username }).exec();
			if (existingUser !== null)
				throw new Error('Username is already in use.');
			return true;
		})
		.escape(),
	// Validate and sanitize: Password
	checkPassword: validator.body('password')
		.trim()
		.isLength({ min: 7, max: 16 }).withMessage('Password must be between 7 and 16 characters.')
		.custom((pass) => {
			const numReg = /[0-9]/;
			if (pass.match(numReg) === null)
				throw new Error('Password must contain numbers');
			return true;
		})
		.escape(),
	// Validate, Sanitize and asserts equal to password: Password Confirmation
	checkPasswordConfirmation: validator.body('passwordConfirmation')
		.trim()
		.custom((passConf, { req }) => {
			if (passConf !== req.body.password) 
				throw new Error('Password confirmation does not match password');
			return true;
		})
		.escape(),
	isExistingUsername: validator.body('username')
		.trim()
		.custom(async (s_username) => {
			const existingUser = await AuthUser.findOne({ 'username': s_username }).exec();
			if (existingUser === null)
				throw new Error('Invalid Username');
			else
				return true;
		}),
	passwordMatches: validator.body('password')
		.trim()
		.custom(async (s_password, { req }) => {
			const existingUser = await AuthUser.findOne({ username: req.body.username }).exec();
			if (existingUser === null)
				throw new Error('Invalid Username');
			if (!existingUser.comparePassword(s_password))
				throw new Error('Invalid Password');
			else
				return true;
		}),
	// redirects home if user tries to access pages without logging in
	checkAuth(req, res, next) {
		if (req.session.userId === null)
			res.redirect('/home');
		next();
	},
	async pushNotification(agentName, action, blogName, blogUrl, bloggerId) {
		const newNoti = new Notification({ agentName, action, blogName, blogUrl });
		await newNoti.save();

		const blogger = await Blogger.findById(bloggerId).exec();
		blogger.notifications.push(newNoti._id);
		blogger.notifications.length = 16;
		
		await blogger.save();
	}
};































