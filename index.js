const mongoose = require('mongoose');
const Models = require('./models.js');
mongoose.connect('process.env.CONNECTION_URI', {
	useNewUrlParser: true, useUnifiedTopology: true });
/*mongoose.connect('mongodb://localhost:27017/myCinemoviesDB', {
	useNewUrlParser: true, useUnifiedTopology: true });*/

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

const express = require('express'), 
			morgan = require('morgan'),
			uuid = require('uuid'),
			bodyParser = require('body-parser'), 
			methodOverride = require('method-override');

const app = express();

const passport = require('passport');
require('./passport');

const { check, validationResult } = require('express-validator');

app.use(bodyParser.json());

let auth = require('./auth')(app);

app.use(morgan('common'));

app.use(methodOverride());

app.use(express.static('public'));

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'https://sulfidate.solutions'];

app.use(cors({
	origin: (origin, callback) => {
		if(!origin) return callback(null, true);
		if(allowedOrigins.indexOf(origin) === -1){ 
			let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
			return callback(new Error(message ), false); 
		}
		return callback(null, true);
	}
}));

// GET requests
app.get('/', (req,res) => {
	res.send('Welcome to my Cinemovie Database (myCMDb)');
});

// Add a user
/* We'll expect JSON in this format
{
	ID: Integer,
	Username: String,
	Password: String,
	Email: String,
	Birthday: Date
}*/
app.post('/users', 
	[
		check('Username', 'Username is required').isLength({min: 5}),
		check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
		check('Password', 'Password is required').not().isEmpty(),
		check('Email', 'Email does not appear to be valid').isEmail()
	], (req, res) => {
		
		let errors = validationResult(req);
		
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		
	let hashedPassword = Users.hashPassword(req.body.Password);
	Users.findOne({ Username: req.body.Username })
		.then((user) => {
			if (user) {
				return res.status(400).send(req.body.Username + ' already exists ');
			} else {
				Users
					.create({
						Username: req.body.Username,
						Password: hashedPassword,
						Email: req.body.Email,
						Birthday: req.body.Birthday
					})
					.then((user) =>{res.status(201).json(user) })
				.catch((error) => {
					console.error(error);
					res.status(500).send('Error: ' + error);
				})
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send('Error: ' + error);
		});
});

// Update user's Info, by username
/* We'll expect JSON in this format
{
	Username: String,
	(required)
	Password: String,
	(required)
	Email: String,
	(required)
	Birthday: Date
}*/
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndUpdate({ Username: req.params.Username }, { $set: 
		{
			Username: req.body.Username,
			Password: req.body.Password,
			Email: req.body.Email,
			Birthday: req.body.Birthday
		}
	},
	{ new: true }, // This line makes sure that the updated document is returned
		(err, updatedUser) => {
			if(err) {
				console.error(err);
				res.status(500).send('Error: ');
			} else {
				res.json(updatedUser);
			}
	});
});

// Add movie to user list of favorites
app.patch('/users/:Username/Favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndUpdate({ Username: req.params.Username }, {
		$push: { FavoriteMovies: req.params.MovieID }
	},
	{ new:true }, //This line makes sure that the updated Document is returned
	(err, updatedUser) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error: ' + err);
		} else {
			res.json(updatedUser);
		}
	});
});

// Delete movie from user list of favorites
app.delete('/users/:Username/FavoritesDelete/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndUpdate({ Username: req.params.Username }, {
		$pull: { FavoriteMovies: req.params.MovieID }
	},
	{ new:true }, //This line makes sure that the updated Document is returned
	(err, updatedUser) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error: ' + err);
		} else {
			res.json(updatedUser);
		}
	});
});

// Allow existing user to deregister
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndRemove({ Username: req.params.Username })
		.then((user) => {
			if (!user) {
				res.status(400).send(req.params.Username + ' was not found');
			} else {
				res.status(200).send(req.params.Username + ' was deleted.');
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Get all Movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.find()
		.then((movies) => {
			res.status(201).json(movies);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Get movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.findOne({ Title: req.params.Title })
		.then((title) => {
			res.json(title);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});	
});

// Get genre by name
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
	Genres.findOne({ Name: req.params.Name })
		.then((genre) => {
		res.json(genre);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});	
});

// Get director by name
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
	Directors.findOne({ Name: req.params.Name })
		.then((director) => {
		res.json(director);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});	
});

// Error Handling requests
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

// Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
	console.log('Your app is listening on port ' + port);
});