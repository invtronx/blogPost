const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bloggerSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'AuthUser' },
	username: { type: String },
	name: { type: String },
	bio: { type: String },
	stars: { type: Number, default: 0 },
	blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
	notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }]
});

// virtual: blogger's URL
bloggerSchema.virtual('url').get(function() {
	return '/blogger/detail/' + this._id;
});

module.exports = mongoose.model('Blogger', bloggerSchema);
