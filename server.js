require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const { parse } = require('json2csv');

// get access token from Spotify API
async function getAccessToken() {
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

    // encode client id and secret
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

     // make POST request
     const response = await axios.post('https://accounts.spotify.com/api/token', 
        'grant_type=client_credentials', {
        headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    return response.data.access_token;
}

// get album/EP details by album id
async function getAlbumDetails(albumId, token) {
    const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data;
}


// get album tracks by album id
async function getAlbumTracks(albumId, token) {
    const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data.items;
}


// get track info by trackid
async function getTrackFeatures(trackId, token) {
    const response = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
}

// convert JSON data to CSV format
function jsonToCsv(jsonArray) {
    return parse(jsonArray);
}


// main function to fetch data and write to CSV
async function saveDataToCSV() {
    try {
        const token = await getAccessToken();

        const albumIds = [
            '03guxdOi12XJbnvxvxbpwG',
            '5TkaDC4mYSLBvdG6UrIB0v',
            '1Iu5sceGmML4CeQ2f5Q6aO',
            '5XX1xVOP61GDQCGaZMLjhO'
        ];

        const albumsDetailsList = [];
        const albumTracksList = [];
        const trackFeaturesList = [];

        for (const albumId of albumIds) {
            const albumDetails = await getAlbumDetails(albumId, token);

            const albumDetailsItems = {
                id: albumDetails.id,
                name: albumDetails.name,
                release_date: albumDetails.release_date,
                total_tracks: albumDetails.total_tracks,
                type: albumDetails.album_type,
                genres: albumDetails.genres.join(', '),
                label: albumDetails.label,
                popularity: albumDetails.popularity,
            };

            albumsDetailsList.push(albumDetailsItems);

            const albumTracks = await getAlbumTracks(albumId, token);
            for (const track of albumTracks) {
                albumTracksList.push({
                    id: track.id,
                    name: track.name,
                    track_number: track.track_number,
                    duration_ms: track.duration_ms,
                    explicit: track.explicit,
                    preview_url: track.preview_url,
                    href: track.href,
                    album_id: albumDetails.id,
                    album_name: albumDetails.name,
                });

                const trackFeatures = await getTrackFeatures(track.id, token);
                trackFeaturesList.push({
                    track_id: track.id,
                    track_name: track.name,
                    album_id: albumDetails.id,
                    duration_ms: trackFeatures.duration_ms,
                    danceability: trackFeatures.danceability,
                    energy: trackFeatures.energy,
                    key: trackFeatures.key,
                    loudness: trackFeatures.loudness,
                    mode: trackFeatures.mode,
                    speechiness: trackFeatures.speechiness,
                    acousticness: trackFeatures.acousticness,
                    instrumentalness: trackFeatures.instrumentalness,
                    liveness: trackFeatures.liveness,
                    valence: trackFeatures.valence,
                    tempo: trackFeatures.tempo,
                    time_signature: trackFeatures.time_signature
                });
            }
        }

        const albumDetailsCsv = jsonToCsv(albumsDetailsList);
        fs.writeFileSync(`all_album_details.csv`, albumDetailsCsv, 'utf8');
        console.log(`All album details CSV written successfully`);

        const albumTracksCsv = jsonToCsv(albumTracksList);
        fs.writeFileSync(`all_album_tracks.csv`, albumTracksCsv, 'utf8');
        console.log(`All album tracks CSV written successfully`);

        const trackFeaturesCsv = jsonToCsv(trackFeaturesList);
        fs.writeFileSync(`all_track_features.csv`, trackFeaturesCsv, 'utf8');
        console.log(`All track features CSV written successfully`);

    } catch (error) {
        console.error('Error fetching or writing data:', error);
    }
}

saveDataToCSV();
