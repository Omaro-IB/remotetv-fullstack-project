import axios from 'axios'

const baseUrl = 'http://192.168.0.101:8945'  // TODO: discover this somehow

const initMPV = () => {
    axios.get(`${baseUrl}/init`)
}

const getLibrary = () => {
    const request = axios.get(`${baseUrl}/ls`)
    return request.then(response => response.data)
}

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

const getStatus = () => {
    return axios.get(`${baseUrl}/status`)
}

const playPause = () => {
    return axios.get(`${baseUrl}/playpause`)
}

const stop = () => {
    return axios.get(`${baseUrl}/stop`)
}

const volume = (volume) => {
    return axios.get(`${baseUrl}/volume/${volume}`)
}

const timestamp = (timestamp) => {
    return axios.get(`${baseUrl}/timestamp/${timestamp}`)
}

export default {getLibrary, playByID, playPause, getStatus, stop, volume, timestamp}