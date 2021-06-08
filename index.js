const express = require('express'), 
			morgan = require('morgan');
			
const app = express();

const bodyParser = require('body-parser'), 
	methodOverride = require('method-override');

// JSON Object 10 Top Movies
let topMovies = [
	{
		movie: 'ALien (1979)',
		director: 'Ridley Scott',
		genre: 'sci-fi / horror / epic'
	},
	{
		movie: 'The Graduate (1967)',
		director: 'Mike Nichols',
		genre: 'drama / romance'
	},
	{
		movie: 'The Breakfast Club (1985)',
		director: 'John Huges',
		genre: 'drama / youth / cult'
	},
	{
		movie: 'Wonder (2017)',
		director: 'Stephen Chbosky',
		genre: 'drama / family'
	},
	{
		movie: 'The Godfather (1972)',
		director: 'Francis Ford Coppola',
		genre: 'thriller'
	},
	{
		movie: 'Mulholland Drive (2001)',
		director: 'David Lynch',
		genre: 'mystery / thriller'
	},
	{
		movie: 'Jaws (1975)',
		director: 'Steven Spielberg',
		genre: 'thriller'
	},
	{
		movie: 'Star Wars (1977)',
		director: 'George Lucas',
		genre: 'sci-fi / epic'
	},
	{
		movie: 'Once Upon a Time in the West (1968)',
		director: 'Sergio Leone',
		genre: 'italo-western / cult / epic'
	},
	{
		movie: 'Chinatown (1974)',
		director: 'Roman Polanski',
		genre: 'thriller / film-noir'
	},
];


app.use(morgan('common'));

app.use(bodyParser.json());

app.use(methodOverride());

app.use(express.static('public'));


// GET requests
app.get('/', (req,res) => {
	res.send('Welcome to my Cinemovie Database (myCMDb)');
});

app.get('/movies', (req, res) => {
	res.json(topMovies);
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
