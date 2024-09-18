import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { formatReleaseDate } from '../helpers/formatter';

export default function AlbumInfoModal({ album, handleClose }) {

  // format album release date
  const formattedReleaseDate = formatReleaseDate(album?.release_date);

  // return album details
  return (
    <Dialog open={Boolean(album)} onClose={handleClose}>
      <DialogTitle>{album?.name || 'Album Name'}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Release Date: {formattedReleaseDate}
        </Typography>
        <Typography variant="body1">
          Total Tracks: {album?.total_tracks || 'N/A'}
        </Typography>
        <Typography variant="body1">
          Label: {album?.label || 'N/A'}
        </Typography>
        <Typography variant="body1">
          Popularity: {album?.popularity || 'N/A'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}