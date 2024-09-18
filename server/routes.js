// imports
const mysql = require('mysql');
const config = require('./config.json');

// mysql connection using credentials in config.json
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// route handlers

// get author
const author = (req, res) => {
  const name = 'Emily Orengo-Castro';
  res.send(name);
};

// get random song
const random = (req, res) => {
  const query = `SELECT name, preview_url FROM tracks ORDER BY RAND() LIMIT 1`;
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.error(err);
      res.json({});
    } else {
      res.json({
        title: data[0].name,
        preview_url: data[0].preview_url
      });
    }
  });
};

// get info for all albums
const albums = (req, res) => {
  const query = `SELECT name, release_date, total_tracks, label, popularity FROM albums ORDER BY release_date DESC`;
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.error(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

// get album songs
const album_songs = (req, res) => {
  const albumName = req.params.album_name;
  const query = `
    SELECT 
      tracks.name,
      tracks.duration_ms,
      tracks.track_number,
      tracks.preview_url 
    FROM 
      tracks
    JOIN 
      albums 
    ON 
      tracks.album_name = albums.name 
    WHERE 
      albums.name = '${albumName}'
    ORDER BY 
      tracks.track_number ASC;
  `;

  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.error(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

// search for song based on features
const search_songs = (req, res) => {
  const title = req.query.title ?? '';
  const durationLow = req.query.duration_low ?? 30000;
  const durationHigh = req.query.duration_high ?? 300000;
  const danceabilityLow = req.query.danceability_low ?? 0;
  const danceabilityHigh = req.query.danceability_high ?? 1;
  const energyLow = req.query.energy_low ?? 0;
  const energyHigh = req.query.energy_high ?? 1;
  const valenceLow = req.query.valence_low ?? 0;
  const valenceHigh = req.query.valence_high ?? 1;
  const explicit = req.query.explicit === 'true' ? 1 : 0;

  const query = `
    SELECT *
    FROM track_features
    WHERE track_name LIKE '%${title}%'
      AND duration_ms >= ${durationLow}
      AND duration_ms <= ${durationHigh}
      AND danceability >= ${danceabilityLow}
      AND danceability <= ${danceabilityHigh}
      AND energy >= ${energyLow}
      AND energy <= ${energyHigh}
      AND valence >= ${valenceLow}
      AND valence <= ${valenceHigh}
    ORDER BY track_name
  `;

  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.error(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

// export
module.exports = {
  author,
  random,
  albums,
  album_songs,
  search_songs
};
