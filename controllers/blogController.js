const validator = require('express-validator');
const mongoose = require('mongoose');

const Blog = require('../models/blog');
const Blogger = require('../models/blogger');
const Comment = require('../models/comment');

const moderator = require('./moderator');
const helper = require('./helper');

mongoose.set('useFindAndModify', false);

module.exports = {
	async getBlogfeed(req, res) {
		const blogs = await Blog.find()
			.sort('-postDate')
			.populate('author')
			.exec();
		res.render('blogfeed', {
			title: 'blogPost: blogFeed',
			blogs: blogs
		});
	}, 
	getWrite(req, res) {
		res.render('blogWrite', { title: 'blogPost: Write Blog' });
	},
	postWrite: [
		validator.body('title')
			.isLength({ min: 1 }).withMessage('Specify blog title.'),
		validator.body('blogBody')
			.isLength({ min: 1 }).withMessage('Specify blog body.'),
		async (req, res, next) => {
			const validationErrors = validator.validationResult(req);
			if (!validationErrors.isEmpty()) {
				res.render('blogWrite', {
					title: 'blogPost: Write Blog',
					errors: validationErrors.array()
				});
			}
			else {
				const blogger = await Blogger.findOne({ user: req.session.userId }).exec();
				const moderatorId = await moderator.getModerator();

				const defComment = new Comment({
					body: 'Regardless of opinion, please maintain respect and refrain from inappropriate remarks in the comment section.',
					commenter: moderatorId
				});

				const newBlog = new Blog({
					title: req.body.title,
					body: req.body.blogBody,
					author: blogger._id,
					comments: [defComment._id]
				});

				const updatedBlogList = blogger.blogs.concat(newBlog._id);
				await Blogger.findOneAndUpdate({ _id: blogger._id }, {
					blogs: updatedBlogList
				});

				await defComment.save();
				await newBlog.save();

				res.redirect('/blog/blogfeed');
			}
		}
	],
	async getEdit(req, res) {
		const blog = await Blog.findById(req.params.id).exec();
		res.render('blogWrite', {
			title: 'blogPost: Edit Blog',
			blog: blog
		});
	},
	postEdit: [
		validator.body('title')
			.isLength({ min: 1 }).withMessage('Specify blog title.'),
		validator.body('blogBody')
			.isLength({ min: 1 }).withMessage('Specify blog body.'),
		async (req, res, next) => {
			const validationErrors = validator.validationResult(req);
			if (!validationErrors.isEmpty()) {
				res.render('blogWrite', {
					title: 'blogPost: Write Blog',
					errors: validationErrors.array()
				});
			}
			else {
				const blogger = await Blogger.findOne({ user: req.session.userId }).exec();
				const blog = await Blog.findById(req.params.id).exec();
				
				blog.title = req.body.title;
				blog.body = req.body.blogBody;

				await blog.save();

				res.redirect('/blog/blogfeed');
			}
		}
	],
	async getComment(req, res) {
		const blog = await Blog.findById(req.params.id)
			.populate('author')
			.exec();
		res.render('blogComment', { 
			title: 'blogPost: Write Comment',
			blog: blog
		});
	},
	postComment: [
		validator.body('comment')
			.isLength({ min: 1 }).withMessage('Specify Comment'),
		async (req, res, next) => {
			const validationErrors = validator.validationResult(req);
			if (!validationErrors.isEmpty()) {
				res.render('blogComment', {
					title: 'blogPost: Write Comment',
					errors: validationErrors.array()
				});
			}
			else {
				const blog = await Blog.findById(req.params.id).exec();
				const blogger = await Blogger.findById(blog.author).exec();
				const agent = await Blogger.findOne({ user: req.session.userId }).exec();
				
				const newComment = new Comment({
					body: req.body.comment,
					commenter: agent._id
				});
				await newComment.save();

				blog.comments.push(newComment._id);
				await blog.save();

				await helper.pushNotification(agent.name, 0, blog.title, blog.url, blogger._id);

				res.redirect('/blog/detail/' + req.params.id);
			}
		}
	],
	async getBlogDetail(req, res) {
		const blog = await Blog.findById(req.params.id)
			.populate('author')
			.populate({
				path: 'comments',
				populate: { path: 'commenter' }
			})
			.exec();
		const agent = await Blogger.findOne({ user: req.session.userId }).exec();

		res.render('blogDetail', {
			title: 'blogPost: Blog Details',
			blog: blog,
			userId: req.session.userId
		});
	},
	async postBlogAction(req, res, next) {
		const action = req.body.action === 'like' ? 'likes' : 'dislikes';
		const increment = req.body.isAdd ? 1 : -1;

		const blogId = req.params.id;
		const blog = await Blog.findById(blogId)
			.populate('author')
			.exec();

		const agent = await Blogger.findOne({ user: req.session.userId }).exec();
		const blogger = blog.author;

		await Blog.updateOne({ _id: blogId }, {
			$inc: { [action]: increment }
		});
		
		await helper.pushNotification(agent.name, increment, blog.title, blog.url, blogger._id);

		res.send(null);
	}
};































