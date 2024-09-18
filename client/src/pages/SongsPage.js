import { useEffect, useState } from 'react';
import { Button, Container, Grid, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { formatDuration } from '../helpers/formatter';

const config = require('../config.json');

export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState([30000, 300000]);
  const [danceability, setDanceability] = useState([0, 1]);
  const [energy, setEnergy] = useState([0, 1]);
  const [valence, setValence] = useState([0, 1]);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_songs?title=${title}` +
      `&duration_low=${duration[0]}&duration_high=${duration[1]}` +
      `&danceability_low=${danceability[0]}&danceability_high=${danceability[1]}` +
      `&energy_low=${energy[0]}&energy_high=${energy[1]}` +
      `&valence_low=${valence[0]}&valence_high=${valence[1]}`
    )
      .then(res => res.json())
      .then(resJson => {
        const songsWithId = resJson.map((song) => ({ id: song.track_id, ...song }));
        setData(songsWithId);
      })
      .catch(err => console.error('Error fetching songs:', err));
  }


  const search = () => {
    fetchSongs();
  }

  // columns for DataGrid
  const columns = [
    { 
      field: 'track_name', 
      headerName: 'Title', 
      width: 300, 
      renderCell: (params) => (
        <div>{params.value}</div>
      ) 
    },
    { 
      field: 'duration_ms', 
      headerName: 'Duration', 
      valueFormatter: ({ value }) => formatDuration(value) 
    },
    { 
      field: 'danceability', 
      headerName: 'Danceability' 
    },
    { 
      field: 'energy', 
      headerName: 'Energy' 
    },
    { 
      field: 'valence', 
      headerName: 'Valence' 
    },
    { 
      field: 'tempo', 
      headerName: 'Tempo' 
    }
  ];
  
  return (
    <Container>
      <h2>Search Songs</h2>
      {/* Search filters */}
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TextField label='Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }} />
        </Grid>
        <Grid item xs={6}>
          <p>Duration</p>
          <Slider
            value={duration}
            min={0}
            max={600000}
            step={1000}
            onChange={(e, newValue) => setDuration(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{formatDuration(value)}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p>Danceability</p>
          <Slider
            value={danceability}
            min={0}
            max={1}
            step={0.1}
            onChange={(e, newValue) => setDanceability(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p>Energy</p>
          <Slider
            value={energy}
            min={0}
            max={1}
            step={0.1}
            onChange={(e, newValue) => setEnergy(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p>Valence</p>
          <Slider
            value={valence}
            min={0}
            max={1}
            step={0.1}
            onChange={(e, newValue) => setValence(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
      </Grid>
      {/* Search button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <Button onClick={() => search()}>
          Search
        </Button>
      </div>
      
      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}
