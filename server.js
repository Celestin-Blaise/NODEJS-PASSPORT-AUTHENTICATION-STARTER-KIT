if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const tempEngine = require('express-handlebars');
const routes = require('./app/routes/routes');

const initializePassport = require('./passport-config');
initializePassport(passport);

//////////*** TEMPLATING ENGINE INTIALISATION */
app.engine('handlebars', tempEngine({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({
	extended: false
}));
app.use(flash());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(routes);

app.use(express.static(path.join(__dirname, 'static')));


/////////*** ROUTES INITIALISATION ***///////////

/////////*** PORT INITIALISATION ***///////////

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`\tServer Spinning On Port ${PORT}`));
