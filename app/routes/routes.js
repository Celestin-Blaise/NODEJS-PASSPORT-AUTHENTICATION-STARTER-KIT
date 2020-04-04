const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const users = require('../../dbConfig/models').users;


router.get('/', checkAuthenticated, (req, res) => {
	res.render('index.handlebars', {
		name: req.user.name,
		id: req.user.id
	})
})

router.get('/someRoute', checkAuthenticated, (req, res) => {
	//res.render('index.handlebars', { name: req.user.name, id: req.user.id})
	res.json(req.user)
})

router.get('/login', checkNotAuthenticated, (req, res) => {

	res.render('login.handlebars')


})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}))

router.get('/register', checkNotAuthenticated, (req, res) => {
	res.render('register.handlebars')
})

router.get('/test', (req, res) => {
	res.json(req.user.id)
})


router.post('/register', checkNotAuthenticated, async (req, res) => {
	try {
		const getUser = (email) => {
			const value = users.findOne({
				where: {
					email: email
				}
			});
			return value;
		};

		const user = await getUser(req.body.email);
		console.log('user:', user)
		if (user) {
			res.render('register.handlebars', {
				error: 'A User with that Email already Exists  '
			})
		} else {
			const hashedPassword = await bcrypt.hash(req.body.password, 10)
			users.create({
				name: req.body.name,
				email: req.body.email,
				password: hashedPassword
			})
			res.redirect('/login')
		}
	} catch {
		res.render('register.handlebars', {
			error: 'A User with that Email already Exists  '
		})
	}
})

router.delete('/logout', (req, res) => {
	req.logOut()
	res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}

	res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/')
	}
	next()
}


module.exports = router;
