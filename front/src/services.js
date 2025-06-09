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

export default {getLibrary, playByID, playPause, getStatus, stop, volume, timestamp, getImgUrl, toggleSub}