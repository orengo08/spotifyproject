import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Divider, Link, Grid, Box, Typography } from '@mui/material';
import AlbumInfoModal from '../components/AlbumInfoModal';

const config = require('../config.json');

export default function HomePage() {
  const [songOfTheDay, setSongOfTheDay] = useState({});
  const [appAuthor, setAppAuthor] = useState('');
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/random`)
      .then(res => res.json())
      .then(data => setSongOfTheDay(data))
      .catch(error => console.error('Error fetching song of the day:', error));

    fetch(`http://${config.server_host}:${config.server_port}/author`)
      .then(res => res.text())
      .then(text => setAppAuthor(text))
      .catch(error => console.error('Error fetching author:', error));

    axios.get(`http://${config.server_host}:${config.server_port}/albums`)
      .then(response => setAlbums(response.data))
      .catch(error => console.error('Error fetching albums:', error));
  }, []);

  // map album names to image paths
  const albumImages = {
    "CINEMA": "/cinema.jpg",
    "Submarine": "/submarine.jpg",
    "Superclean, Vol. II": "/supercleanvol2.jpeg",
    "Superclean, Vol. I": "/supercleanvol1.jpeg"
  };

  return (
    <Container>
       {/* render AlbumInfoModal when album is selected */}
      {selectedAlbum && (
        <AlbumInfoModal album={selectedAlbum} handleClose={() => setSelectedAlbum(null)} />
      )}

      {/* box for song of the day */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Check out your song of the day:&nbsp;
          {songOfTheDay.preview_url ? (
            <Link href={songOfTheDay.preview_url} target="_blank" rel="noopener noreferrer">
              {songOfTheDay.title || 'Loading...'}
            </Link>
          ) : (
            'Loading...'
          )}
        </Typography>
        <Divider />
      </Box>

      {/* box for albums */}
      <Box sx={{ marginY: 4 }}>
        <Typography variant="h5" gutterBottom>
          Albums
        </Typography>
        <Grid container spacing={2}>
          {albums.map(album => (
            <Grid item xs={12} sm={6} md={3} key={album.album_id}>
              <Box
                sx={{
                  height: 300,
                  width: '100%',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center', 
                  backgroundImage: `url(${albumImages[album.name] || '/default.jpg'})`,
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedAlbum(album)}
              >
          
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* author section */}
      <Divider />
      <Typography variant="body1">
        Created by: {appAuthor || 'Loading...'}
      </Typography>
    </Container>
  );
}