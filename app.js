/******************************************************************************
***
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Mihirbhai Hiteshbhai Hirpara Student ID: N01635700 Date: 28/10/2024
*
*
******************************************************************************
**/

var express = require('express');
var path = require('path');
var app = express();
const { engine } = require('express-handlebars');
const movies_JsonData = require('./movieData/movieData.json');
const port = process.env.port || 3000;

// Set up static files path
app.use(express.static(path.join(__dirname, 'public')));

// Set up Handlebars template engine with helper registration
app.engine('.hbs', engine({
    extname: '.hbs',
    helpers: {
        notEqualsto: function (a, b) {
            return a != b;
        },
        highlightnullNoMetascore: function (metascore) {
            return !metascore || metascore === 'N/A' ? 'highlighted_row' : '';
        }
    }
}));
app.set('view engine', 'hbs');

// Define routes
app.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

app.get('/users', function (req, res) {
    res.send('respond with a resource');
});

app.get('/data', (req, res) => {
    res.render('data', { title: 'Express' });
});

app.get('/data/movie/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < movies_JsonData.length) {
        const movie = movies_JsonData[index];
        console.log(movie.Title);
        res.render('databyindex', { movie });
    } else {
        res.status(404);
        res.render('error');
    }
});

app.use(express.urlencoded({ extended: true }));

app.get('/data/search/id', (req, res) => {
    res.render('searchdatabyid');
});

app.get('/data/search', (req, res) => {
    const movie_id = req.query.movie_id;
    const movie = movies_JsonData.find(m => m.Movie_ID === 1001 + parseInt(movie_id));
    if (movie) {
        res.render('searchresult', { movie });
    } else {
        res.status(404);
        res.render('error');
    }
});

app.get('/data/search/title', (req, res) => {
    res.render('searchdatabytitle');
});

app.get('/data/search_by_title', (req, res) => {
    const movie_title = req.query.movie_title;
    const movies = movies_JsonData.filter(m => m.Title.includes(movie_title));
    if (movies.length > 0) {
        const result = movies.map(movie => ({
            Title: movie.Title,
            Year: movie.Year,
            Released: movie.Released,
            Genre: movie.Genre,
            Actors: movie.Actors,
            Country: movie.Country,
            Language: movie.Language
        }));
        res.render('searchresultbytitle', { result });
    } else {
        res.status(404);
        res.render('error');
    }
});

app.get('/allData', (req, res) => {
    const movies = movies_JsonData;
    console.log(movies);
    if (movies.length > 0) {
        const result = movies.map(movie => ({
            Title: movie.Title,
            Year: movie.Year,
            Released: movie.Released,
            Genre: movie.Genre,
            Actors: movie.Actors,
            Country: movie.Country,
            Language: movie.Language,
            Metascore: movie.Metascore
        }));
        res.render('allData', { result });
    } else {
        res.status(404);
        res.render('error');
    }
});

// Catch-all route for undefined URLs
app.get('*', function (req, res) {
    res.render('error', { title: 'Error', message: 'Wrong Route' });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
