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

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
	res.json(topMovies.find((movie) => 
		{ return movie.title === req.params.title }));
});

// Return data about a genre (description) by title
app.get('/genres/:title', (req, res) => {
	res.json(topMovies.find((genre) => 
		{ return genre.title === req.params.title }));
});

// Return data about a director (bio, birth year, death year) by name
app.get('/directors/:director', (req, res) => {
	res.json(topMovies.find((director) =>
		{ return director.director === req.params.director }));
	});
	
// Allow new users to register
app.post('/users', (req, res) => {
	let newUser = req.body;
	
	if (!newUser.name) {
		const message = 'Missing name in request body';
		res.status(400).send(message);
	} else {
		newUser.id = uuid.v4();
		users.push(newUser);
		res.status(201).send(newUser);
	}
});

// Allow users to update their user info (username)
app.put('/users/:username', (req, res) => {
	let userName = users.find((username) => 
			res.send('Student with the name was not found.'));
});
	
// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
app.put('/users/movies/:favorites', (req, res) => {
	let userFavorite = topMovies.find((movie) => 
	res.send('Movie added to favorites'));
});
	
// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
app.delete('/users/movies/:favorites', (req, res) => {
	let userFavorite = topMovies.find((movie) => 
	res.send('Movie deleted from favorites'));
});

// Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
app.delete('/users/:username', (req, res) => {
	let deRegister = users.find((user) => 
	res.send('user / email has been removed'));
});
// app.delete('/users', (req, res) => {
// 	let newUser = req.body;
// 	
// 	if (!newUser.name) {
// 		const message = 'Missing name in request body';
// 		res.status(400).send(message);
// 	} else {
// 		newUser.id = uuid.v4();
// 		users.push(newUser);
// 		res.status(201).send(newUser);
// 	}
// });


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
