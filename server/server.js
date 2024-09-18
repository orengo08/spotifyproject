const express = require('express');
const cors = require('cors');
const config = require('./config.json');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// use express to define API endpoints and provide their handlers implemented in routes.js
app.get('/author', routes.author);
app.get('/random', routes.random);
app.get('/albums', routes.albums);
app.get('/album_songs/:album_name', routes.album_songs);
app.get('/search_songs', routes.search_songs);

// start server
app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

// export app 
module.exports = app;
