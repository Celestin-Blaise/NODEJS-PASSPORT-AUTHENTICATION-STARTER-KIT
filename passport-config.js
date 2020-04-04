const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const users = require('./dbConfig/models').users;

function initialize(passport) {
	const authenticateUser = async (email, password, done) => {
		const getUser = (email) => {
			const value = users.findOne({
				where: {
					email: email
				}
			});
			return value;
		};

		const user = await getUser(email);

		if (user == null) {
			return done(null, false, {
				message: 'No user with that email'
			});
		}
		try {
			if (await bcrypt.compare(password, user.password)) {
				return done(null, user);
			} else {
				return done(null, false, {
					message: 'Password incorrect'
				});
			}
		} catch (e) {
			return done(e);
		}
	}


	passport.use(new LocalStrategy({
		usernameField: 'email'
	}, authenticateUser));

	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser(async (id, done) => {
		const getId = async (id) => {
			const value = await users.findOne({
				where: {
					id: id
				}
			});
			return value;
		};
		return done(null, await getId(id));
	});
}


module.exports = initialize;
