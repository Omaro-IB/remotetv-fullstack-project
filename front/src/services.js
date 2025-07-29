import axios from 'axios'

// Assumes backend is hosted on same machine on port 8945
const origin = window.location.origin.split(":")
const baseUrl = `${origin[0]}:${origin[1]}:8945`

// GET /init to initialize mpv
const initMPV = () => {
    axios.get(`${baseUrl}/init`)
}

// GET /ls to get library data
const getLibrary = () => {
    const request = axios.get(`${baseUrl}/ls`)
    return request.then(response => response.data)
}

// GET /load/:mediaID to play a media
const playByID = (id) => {
    const request = axios.get(`${baseUrl}/load/${id}`)
    return new Promise((resolve, reject) => {
        request
            .then(() => resolve())  // if request succeeds, then resolve promise
            .catch((error) => {  // if not...
                    if (error.response.status === 401) {  // if 401 error (MPV not started), ...
                        initMPV();  // then try init-ing MPV
                        setTimeout(() => {  // then a second later try request again
                            axios.get(`${baseUrl}/load/${id}`).then(() => resolve()).catch(() => reject())
                        }, 1000);
                    } else {
                        reject();  // if not 500 error, then something else went wrong, and just reject the promise
                    }
                }
            )
    })
}

// GET /status to get media player status
const getStatus = () => {
    return axios.get(`${baseUrl}/status`)
}

// GET /playpause to toggle play/pause
const playPause = () => {
    return axios.get(`${baseUrl}/playpause`)
}

// GET /togglesub to toggle subtitles
const toggleSub = () => {
    return axios.get(`${baseUrl}/togglesub`)
}

// GET /stop to stop playback
const stop = () => {
    return axios.get(`${baseUrl}/stop`)
}

// GET /volume/:volume to adjust volume
const volume = (volume) => {
    return axios.get(`${baseUrl}/volume/${volume}`)
}

// GET /timestamp/:timestamp to adjust timestamp
const timestamp = (timestamp) => {
    return axios.get(`${baseUrl}/timestamp/${timestamp}`)
}

// Image URL
const getImgUrl = (i0, i1, i2) => {
    if (i1 === undefined || i2 === undefined) {
        return `${baseUrl}/image/${i0}`
    } else {
        return `${baseUrl}/image/${i0}/${i1}/${i2}`
    }
}

// GET /scanstatus
const scannerStatus = () => {
    return axios.get(`${baseUrl}/scanstatus`)
}

// GET /rescan
const rescanScanner = () => {
    return axios.get(`${baseUrl}/rescan`)
}

// Strip extension and extract quality/date if present in name
function parseMediaFilename(filename) {
    // Remove the file extension
    const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '');

    // Extract the title
    const titleMatch = nameWithoutExtension.match(/^(.*?)\s*(\(\d{4}\))?\s*(\[\d{3,4}p\])?$/);
    let title = '', date = undefined, quality = undefined;

    if (titleMatch) {
        title = titleMatch[1].trim();

        // Extract date (year)
        const dateMatch = nameWithoutExtension.match(/\((\d{4})\)/);
        if (dateMatch) {
            date = parseInt(dateMatch[1], 10);
        }

        // Extract quality
        const qualityMatch = nameWithoutExtension.match(/\[(\d{3,4}p)\]/);
        if (qualityMatch) {
            quality = qualityMatch[1];
        }
    }

    return {
        name: title,
        quality: quality,
        release: date
    };
}

function formatEpisodeString(input) {
    // Remove file extension if present
    const base = input.replace(/\.[^/.]+$/, '').toLowerCase();

    // Match "s##e##" pattern
    const seasonEpisodeMatch = base.match(/^s(\d{1,2})e(\d{1,2})$/);
    if (seasonEpisodeMatch) {
        const season = parseInt(seasonEpisodeMatch[1], 10);
        const episode = parseInt(seasonEpisodeMatch[2], 10);
        return `Season ${season} Episode ${episode}`;
    }

    // Match "e##" pattern
    const episodeOnlyMatch = base.match(/^e(\d{1,2})$/);
    if (episodeOnlyMatch) {
        const episode = parseInt(episodeOnlyMatch[1], 10);
        return `Episode ${episode}`;
    }

    // Return input unchanged if no match
    return input;
}

export default {getLibrary, playByID, playPause, getStatus, stop, volume, timestamp, getImgUrl, toggleSub, scannerStatus, rescanScanner, parseMediaFilename, formatEpisodeString}