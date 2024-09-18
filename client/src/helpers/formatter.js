// function formats duration from milliseconds to MM:SS
export function formatDuration(milliseconds) {
  if (milliseconds == null || isNaN(milliseconds)) return 'Unknown';

  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// function formats release date to Month/Day/Year
export function formatReleaseDate(date) {
  if (!date) return 'Unknown';
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
