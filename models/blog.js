const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
	title: { type: String, required: true, max: 100 },
	author: { type: Schema.Types.ObjectId, ref: 'Blogger', required: true },
	body: { type: String, required: true },
	postDate: { type: Date, default: Date.now() },
	likes: { type: Number, default: 0 },
	dislikes: { type: Number, default: 0 },
	comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

// virtual: blog's URL
blogSchema.virtual('url').get(function() {
	return '/blog/detail/' + this._id;
});

// virtual: blog's relative post time => string (eg. 1 hour)
blogSchema.virtual('relativePostTime').get(function() {
	return moment(this.postDate).toNow(true);
});

// virtual: blog's formatted post time
blogSchema.virtual('formattedPostTime').get(function() {
	return moment(this.postDate).format('MMMM D, YYYY');
});

// virtual: blog's pretty format
blogSchema.virtual('fmt').get(function() {
	let lines = [];

	lines.push('=== A blogPost Original ===', '');
	lines.push(this.title, 'By ' + this.author.name, '');
	lines.push(this.body, '');
	lines.push('Posted on: ' + moment(this.postDate).format('MMM D, YYYY'));
	lines.push('Number of Likes: ' + this.likes.toString(10));
	
	return lines.join('\n');
});

module.exports = mongoose.model('Blog', blogSchema);
