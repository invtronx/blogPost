const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const authUserSchema = new Schema({
	username: { type: String, required: true },
	password: { type: String },
	blogger: { type: Schema.Types.ObjectId, ref: 'Blogger' }
});

// virtual: Hashed password setter
authUserSchema.virtual('setPassword').set(async function(pass) {
	const salt = crypto.randomBytes(8).toString();
	const hashBuf = crypto.scryptSync(pass, salt, 64);
	const hash = hashBuf.toString('hex');
	const password = hash + '.' + salt;
	this.set({ password });
});

// instance: Compare true password with supplied plain(unhashed) password
authUserSchema.method('comparePassword', function(supplied) {
	const [ hash, salt ] = this.password.split('.');
	const suppliedHashBuf = crypto.scryptSync(supplied, salt, 64);
	const suppliedHash = suppliedHashBuf.toString('hex');
	return hash === suppliedHash;
});

module.exports = mongoose.model('AuthUser', authUserSchema);
