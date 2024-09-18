import { useEffect, useState } from 'react';
import { Container, Divider, Grid, Typography, Box, List, ListItem, Link, Paper } from '@mui/material';
import { formatDuration } from '../helpers/formatter';
import axios from 'axios';

const config = require('../config.json');

// map album names to their image paths
const albumImages = {
  "CINEMA": "/cinema.jpg",
  "Submarine": "/submarine.jpg",
  "Superclean, Vol. II": "/supercleanvol2.jpeg",
  "Superclean, Vol. I": "/supercleanvol1.jpeg"
};

export default function SongsPage() {
  const [albums, setAlbums] = useState([]);
  const [albumSongs, setAlbumSongs] = useState({});

  useEffect(() => {
    axios.get(`http://${config.server_host}:${config.server_port}/albums`)
      .then(res => {
        const fetchedAlbums = res.data;
        setAlbums(fetchedAlbums);

        fetchedAlbums.forEach(album => {
          axios.get(`http://${config.server_host}:${config.server_port}/album_songs/${album.name}`)
            .then(res => {
              console.log(`Songs for album ${album.name}:`, res.data); 
              setAlbumSongs(prevSongs => ({
                ...prevSongs,
                [album.name]: res.data
              }));
            })
            .catch(err => console.error('Error fetching songs:', err));
        });
      })
      .catch(err => console.error('Error fetching albums:', err));
  }, []); 

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Songs by Album
      </Typography>
      <Divider />

      {/* render each album */}
      {albums.map(album => (
        <Box key={album.name} sx={{ marginBottom: 4 }}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={3} md={3}>
              <Box
                sx={{
                  height: 200,
                  width: '100%',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundImage: `url(${albumImages[album.name] || '/default.jpg'})`, // Fallback image
                }}
              />
            </Grid>
            <Grid item xs={12} sm={9} md={9}>
              <Typography variant="h5" gutterBottom>{album.name}</Typography>
              <Paper sx={{ padding: 2 }}>
                <Grid container>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Track Name
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sm={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                      Duration
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sm={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                      Preview
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ marginY: 1 }} />
                <List>
                  {/* render songs for album */}
                  {albumSongs[album.name]?.length ? (
                    albumSongs[album.name].map(song => (
                      <ListItem key={song.track_number} sx={{ display: 'flex', padding: '8px 0' }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={4} sm={4}>
                            <Typography variant="body1">
                              {song.track_number}. {song.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={2} sm={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Typography variant="body1">
                              {formatDuration(song.duration_ms)}
                            </Typography>
                          </Grid>
                          <Grid item xs={4} sm={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {song.preview_url && (
                              <Link href={song.preview_url} target="_blank" rel="noopener noreferrer">
                                Preview
                              </Link>
                            )}
                          </Grid>
                        </Grid>
                      </ListItem>
                    ))
                  ) : (
                    <Typography>Loading songs...</Typography>
                  )}
                </List>
              </Paper>
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 2 }} />
        </Box>
      ))}
    </Container>
  );
}
