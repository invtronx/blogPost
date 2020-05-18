const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
	body: { type: String, required: true },
	postDate: { type: Date, default: Date.now() },
	commenter: { type: Schema.Types.ObjectId, ref: 'Blogger', required: true }
});

// virtual: comment's relative post time => string (eg. 5 minutes)
commentSchema.virtual('relativePostTime').get(function() {
	return moment(this.postDate).toNow(true);
});

module.exports = mongoose.model('Comment', commentSchema);
