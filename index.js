const express = require('express'), 
			morgan = require('morgan'),
			uuid = require('uuid'),
			bodyParser = require('body-parser'), 
			methodOverride = require('method-override');

const app = express();

app.use(morgan('common'));

app.use(bodyParser.json());

app.use(methodOverride());

app.use(express.static('public'));

// JSON Object 10 Top Movies
let topMovies = [
	{
		title: 'Alien',
		director: 'Ridley Scott',
		genre: 'sci-fi'
	},
	{
		title: 'The Graduate',
		director: 'Mike Nichols',
		genre: 'drama'
	},
	{
		title: 'The Breakfast Club',
		director: 'John Huges',
		genre: 'cult'
	},
	{
		title: 'Wonder',
		director: 'Stephen Chbosky',
		genre: 'family'
	},
	{
		title: 'The Godfather',
		director: 'Francis Ford Coppola',
		genre: 'thriller'
	},
	{
		title: 'Mulholland Drive',
		director: 'David Lynch',
		genre: 'mystery'
	},
	{
		title: 'Jaws',
		director: 'Steven Spielberg',
		genre: 'thriller'
	},
	{
		title: 'Star Wars',
		director: 'George Lucas',
		genre: 'sci-fi'
	},
	{
		title: 'Once Upon a Time in the West',
		director: 'Sergio Leone',
		genre: 'italo-western'
	},
	{
		title: 'Chinatown',
		director: 'Roman Polanski',
		genre: 'film-noir'
	},
];

// GET requests
app.get('/', (req,res) => {
	res.send('Welcome to my Cinemovie Database (myCMDb)');
});

// Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
	res.json(topMovies);
});

// Return data about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
	res.json(topMovies.find((movie) => 
		{ return movie.title === req.params.title }));
});

// Return data about a genre by title
app.get('/movies/genres/:title', (req, res) => {
	res.send('Successful GET request returning data about the genre of a single movie');
});

// Return data about a director by name
app.get('/movies/directors/:name', (req, res) => {
	res.send('Successful GET request returning data about a director by name')
	});
	
// Allow new users to register
app.post('/users', (req, res) => {
	res.send('Successful POST request allow new user to register');
});

// Allow users to update their user info
app.put('/users/:username', (req, res) => {
	res.send('Successful PUT request allows users to update user-info');
});
	
// Allow users to add a movie to their list of favorites
app.patch('/users/:username/favorites/:title', (req, res) => {
	let userFavorite = topMovies.find((movie) => 
	res.send('Movie added to favorites'));
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:username/favorites/:title', (req, res) => {
	let userFavorite = topMovies.find((movie) => 
	res.send('Movie deleted from favorites'));
});

// Allow existing users to deregister
app.delete('/users/:username', (req, res) => {
	res.send('user / email has been removed');
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
