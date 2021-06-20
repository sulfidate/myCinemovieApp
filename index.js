const mongoose = require('mongoose');
const Models = require('./models.js');
mongoose.connect('mongodb://localhost:27017/myCinemoviesDB', {
	useNewUrlParser: true, useUnifiedTopology: true });

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

app.use(bodyParser.json());

app.use(morgan('common'));

app.use(methodOverride());

app.use(express.static('public'));

// GET requests
app.get('/', (req,res) => {
	res.send('Welcome to my Cinemovie Database (myCMDb)');
});

// Get all users
app.get('/users', (req, res) => {
	Users.find()
		.then((users) => {
			res.status(201).json(users);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
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
app.post('/users', (req, res) => {
	Users.findOne({ Username: req.body.Username })
		.then((user) => {
			if (user) {
				return res.status(400).send(req.body.Username + ' already exists ');
			} else {
				Users
					.create({
						Username: req.body.Username,
						Password: req.body.Password,
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

// Get user by username
app.get('/users/:Username', (req, res) => {
	Users.findOne({ Username: req.params.Username })
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
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
app.put('/users/:Username', (req, res) => {
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
app.patch('/users/:Username/Favorites/:MovieID', (req, res) => {
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
app.delete('/users/:Username/FavoritesDelete/:MovieID', (req, res) => {
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
app.delete('/users/:Username', (req, res) => {
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
app.get('/movies', (req, res) => {
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
app.get('/movies/:Title', (req, res) => {
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
app.get('/genres/:Name', (req, res) => {
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
app.get('/directors/:Name', (req, res) => {
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
app.listen(8080, () => {
	console.log('Your app is listening on port 8080.');
});
