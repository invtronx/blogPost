const mongoose = require('mongoose');

const Notification = require('../models/notification');
const Blogger = require('../models/blogger');
const Blog = require('../models/blog');

module.exports = {
	async getNotification(req, res) {
		const blogger = await Blogger.findOne({ user: req.session.userId })
			.populate('notifications')
			.exec();
		res.render('notifications', { 
			title: 'blogPost: Notifications',
			notifs: blogger.notifications
		});
	}
};
