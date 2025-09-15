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

// GET /ytdl/0 to check whether yt-dl is available
function checkYouTubeAvailable() {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/ytdl/0`).then(() => resolve(true)).catch((error) => {
            if (error.response.status === 404) {resolve(false)}  // 404 means no yt-dl available
            else if (error.response.status === 400) {resolve(true)}  // 400 means yt-dl is available but video ID of 0 is invalid
            else {reject()}  // some other unexpected error occurred
        })
    })
}

// GET /ytdl/:vidid to play a YouTube video
const playYouTube = (input) => {
    return new Promise((resolve, reject) => {
        let video_id

        // Regular expression to match different types of YouTube URLs
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        // Try to match the input against the regex
        const match = input.match(regex);
        if (match && match[1]) {
            video_id = match[1]; // Extracted video ID from URL
        }
        // If it's not a full URL, check if it's a valid YouTube video ID
        const isVideoId = /^[a-zA-Z0-9_-]{11}$/.test(input);
        if (isVideoId) {
            video_id = input; // It's already a video ID
        }

        // Invalid input
        if (video_id === undefined) {reject()}
        else {  // Valid input
            const request = axios.get(`${baseUrl}/ytdl/${video_id}`)
            request
                .then(() => resolve())  // if request succeeds, then resolve promise
                .catch((error) => {  // if not...
                        if (error.response.status === 401) {  // if 401 error (MPV not started), ...
                            initMPV();  // then try init-ing MPV
                            setTimeout(() => {  // then a second later try request again
                                axios.get(`${baseUrl}/ytdl/${video_id}`).then(() => resolve()).catch(() => reject())
                            }, 1000);
                        } else {
                            reject();  // if not 500 error, then something else went wrong, and just reject the promise
                        }
                    }
                )
        }
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

// GET /cycleaudio to cycle audio tracks
const cycleAudio = () => {
    return axios.get(`${baseUrl}/cycleaudio`)
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

function formatEpisodeString(input, name=undefined) {
    // Remove file extension if present
    const base = input.replace(/\.[^/.]+$/, '').toLowerCase();

    // Match "s##e##" pattern
    const seasonEpisodeMatch = base.match(/^s(\d{1,2})e(\d{1,2})$/);
    if (seasonEpisodeMatch) {
        const season = parseInt(seasonEpisodeMatch[1], 10);
        const episode = parseInt(seasonEpisodeMatch[2], 10);
        if (name === undefined) {return `Season ${season} Episode ${episode}`}
        else {return `Season ${season} Episode ${episode}: ${name}`}

    }

    // Match "e##" pattern
    const episodeOnlyMatch = base.match(/^e(\d{1,2})$/);
    if (episodeOnlyMatch) {
        const episode = parseInt(episodeOnlyMatch[1], 10);
        if (name === undefined) {return `Episode ${episode}`}
        else {return `${episode}. ${name}`}
    }

    // Return base file unchanged if no match
    return base;
}

export default {getLibrary, playByID, playPause, getStatus, stop, volume, timestamp, getImgUrl, toggleSub, cycleAudio, scannerStatus, rescanScanner, parseMediaFilename, formatEpisodeString, playYouTube, checkYouTubeAvailable}
