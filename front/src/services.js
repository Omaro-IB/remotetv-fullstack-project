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

// GET /plugins to get plugins data
const getPlugins = () => {
    const request = axios.get(`${baseUrl}/plugins`)
    return request.then(response => response.data)
}

// GET /plugins/search/:pluginID?q=<query> to search using some plugin
const searchPlugin = (pluginID, query) => {
    const request = axios.get(`${baseUrl}/plugins/search/${pluginID}?q=${query}`)
    return request.then(response => response.data)
}

// GET /plugins/download/:pluginID?s=<source> to download using some plugin
const downloadPlugin = (pluginID, source) => {
    const request = axios.get(`${baseUrl}/plugins/download/${pluginID}?s=${source}`)
    return request.then(response => response.data)
}

// Returns IP of a plugin's thumbnail
const pluginThumbnail = (plugin) => (`${baseUrl}/plugins/thumbnail/${plugin}`)

// GET /load/:mediaID to play a single media
const playByID = (id) => {
    const request = axios.get(`${baseUrl}/load/${id}`)
    return new Promise((resolve, reject) => {
        request
            .then(() => resolve())  // if request succeeds, then resolve promise
            .catch((error) => {  // if not...
                    if (error.response.status === 401) {  // if 401 error (MPV not started), ...
                        initMPV();  // then try init-ing MPV
                        setTimeout(() => {  // then half a second later try request again
                            axios.get(`${baseUrl}/load/${id}`).then(() => resolve()).catch(() => reject())
                        }, 500);
                    } else {
                        reject();  // if not 500 error, then something else went wrong, and just reject the promise
                    }
                }
            )
    })
}

// GET /load/:mediaID/:season/:episode to play a series media
const playTVByID = (id, season, episode) => {
    const request = axios.get(`${baseUrl}/load/${id}/${season}/${episode}`)
    return new Promise((resolve, reject) => {
        request
            .then(() => resolve())  // if request succeeds, then resolve promise
            .catch((error) => {  // if not...
                    if (error.response.status === 401) {  // if 401 error (MPV not started), ...
                        initMPV();  // then try init-ing MPV
                        setTimeout(() => {  // then half a second later try request again
                            axios.get(`${baseUrl}/load/${id}/${season}/${episode}`).then(() => resolve()).catch(() => reject())
                        }, 500);
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

export default {getLibrary, getPlugins, searchPlugin, downloadPlugin, pluginThumbnail, playByID, playTVByID, playPause, getStatus, stop, volume, timestamp}