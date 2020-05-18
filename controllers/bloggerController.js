const Blogger = require('../models/blogger');
const validator = require('express-validator');
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

module.exports = {
	async getBloggerList(req, res) {
		const bloggers = await Blogger.find()
			.sort('name')
			.exec();
		res.render('bloggerList', {
			title: 'blogPost: Bloggers',
			bloggers: bloggers
		});
	}, 
	async getBloggerDetail(req, res) {
		const blogger = await Blogger.findById(req.params.id)
			.populate('blogs')
			.exec();
		res.render('bloggerDetail', {
			title: 'blogPost: Blogger Detail',
			blogger: blogger
		});
	},
	async getBloggerForm(req, res) {
		const blogger = await Blogger.findOne({ user: req.session.userId }).exec();
		res.render('bloggerForm', { 
			title: 'blogPost: Complete Profile',
			username: blogger.username
		});
	},
	postBloggerForm: [
		validator.body('name')
			.isLength({ min: 1 }).withMessage('Specify name of user')
			.escape(),
		async (req, res, next) => {
			const blogger = await Blogger.findOne({ user: req.session.userId }).exec();
			const validationErrors = validator.validationResult(req);
			if (!validationErrors.isEmpty()) {
				res.render('bloggerForm', {
					title: 'blogPost: Complete Profile',
					username: blogger.username,
					errors: validationErrors.array()
				});
			}
			else {
				await Blogger.findOneAndUpdate({ _id: blogger._id }, {
					name: req.body.name,
					bio: req.body.bio
				});
				res.redirect('/blog/blogfeed');
			}
		}
	],
	async getBloggerWall(req, res) {
		const blogger = await Blogger.findOne({ user: req.session.userId })
			.populate('blogs')
			.exec();
		res.render('mywall', {
			title: 'blogPost: My Wall',
			blogger: blogger
		});
	},
	async getWallEdit(req, res) {
		const blogger = await Blogger.findOne({ user: req.session.userId }).exec();
		res.render('mywallEdit', {
			title: 'blogPost: Edit Wall',
			blogger: blogger
		});
	},
	postWallEdit: [
		validator.body('name')
			.isLength({ min: 1 }).withMessage('Specify name of user')
			.escape(),
		async (req, res, next) => {
			const blogger = await Blogger.findOne({ user: req.session.userId }).exec();
			const validationErrors = validator.validationResult(req);
			if (!validationErrors.isEmpty()) {
				res.render('blogPost: Edit Wall', {
					title: 'blogPost: Complete Profile',
					blogger: blogger,
					errors: validationErrors.array()
				});
			}
			else {
				await Blogger.findOneAndUpdate({ _id: blogger._id }, {
					name: req.body.name,
					bio: req.body.bio
				});
				res.redirect('/blogger/wall');
			}
		}
	],
	async postStar(req, res) {
		const blogger = await Blogger.findById(req.params.id).exec();
		const increment = req.body.isAdd ? 1 : -1;

		blogger.stars += increment;
		await blogger.save();

		res.send(null);
	}
};






















