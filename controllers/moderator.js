const Blogger = require('../models/blogger');

module.exports = {
	async getModerator() {
		const mod = await Blogger.findOne({ username: '@moderator' }).exec();
		if (mod === null) {
			const newModerator = new Blogger({
				username: '@moderator',
				name: 'Moderator'
			});
			await newModerator.save();
			return newModerator._id;
		}
		else {
			return mod._id;
		}
	}
}
