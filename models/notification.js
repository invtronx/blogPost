const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
	postDate: { type: Date, default: Date.now() },
	action: { type: Number },
	agentName: { type: String, required: true },
	blogName: { type: String, required: true },
	blogUrl: { type: String, required: true }
});

// virtual: notification's relative post time => string (eg. 30 seconds)
notificationSchema.virtual('relativePostTime').get(function() {
	return moment(this.postDate).toNow(true);
});

// virtual: notification's action translation => string
notificationSchema.virtual('translateAction').get(function() {
	return (this.action == 1 ? 'liked' : this.action == 0 ? 'commented on' : 'disliked');
});

// virtual: notification message generator => string
notificationSchema.virtual('generateMessage').get(function() {
	return this.agentName + ' ' + this.translateAction + ' ' + 'your blog "' + this.blogName + '"';
});

module.exports = mongoose.model('Notification', notificationSchema);
