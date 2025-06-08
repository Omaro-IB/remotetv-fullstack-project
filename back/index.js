'use strict';

// BEGIN: Imports
import express from 'express'
import http from 'http'
import mpvAPI from 'node-mpv'
import cors from 'cors'
import { parseCli } from "./cli.js";
import {createLibrary} from "./librarylib.js";
// END: Imports


// BEGIN: App initialization
const directories = parseCli(process.argv)
if (directories === undefined) {  // invalid or missing CLI arguments
    process.exit()
}
let {library, warnings, errors} = createLibrary(directories.collections_dirs, directories.single_dirs, directories.library_dirs)
const mpv = new mpvAPI({"verbose": true}, ["--fullscreen"])
const app = express()
app.use(express.json())
app.use(cors())
app.disable('etag')
// END: App initialization


const getStatus = () => {
    let status = {"playing": undefined, "resumed": undefined, "time": undefined, "endTime": undefined, "volume": undefined}
    let no_catches = true

    // Set "playing" = info of playing media
    const promise1 = mpv.getProperty("path").then(media_path => {
        // Find the media that is playing, and its group (if relevant) from path
        toploop:
            for (const media of library) {
                if ('items' in media) {  // Media is a collection
                    for (const [group_i, group] of media["items"].entries()) {
                        for (const [item_i, item] of group.entries()) {
                            if (item["path"] === media_path) {status["playing"] = media; status["group"] = group_i; status["item"] = item_i; break toploop}
                        }
                    }
                } else {  // Media is a single
                    if (media["item"]["path"] === media_path) {status["playing"] = media; break}
                }
            }
    }).catch((e) => {no_catches = false})

    // Set "resumed" = true/false
    const promise2 = mpv.getProperty("core-idle").then(idle => {
        status["resumed"] = !idle
    }).catch((e) => {no_catches = false})

    // Set "time" = integer time
    const promise3 = mpv.getProperty("time-pos").then(time => {
        status["time"] = time
    }).catch((e) => {no_catches = false})

    // Set "endTime" = integer time
    const promise4 = mpv.getProperty("duration").then(endTime => {
        status["endTime"] = endTime
    }).catch((e) => {no_catches = false})

    // Set "volume" = integer volume
    const promise5 = mpv.getProperty("ao-volume").then(volume => {
        status["volume"] = volume
    }).catch((e) => {no_catches = false})

    return new Promise((resolve) => {
        Promise.all([promise1, promise2, promise3, promise4, promise5]).then(() => {
            if (no_catches) {resolve(status)}
            else {resolve({"playing": false})}
        })
    })
}


// BEGIN: Endpoints for info
// Initialize MPV
app.get('/init', (req, res) => {
  mpv.start()
  .then(() => {
    res.status(200).send("Successfully started MPV")
  }).catch((error) => {
      if (error["errcode"] === 6) {res.status(400).send("Error starting MPV; MPV is already running")}
      else {console.log(error); res.status(500).send("Error starting MPV; See logs for more details")}
  })
})

// List library
app.get('/ls/', (req, res) => {
    try {
      res.status(200).json(library)
    } catch (error) {
      console.log(error)
      res.status(500).send("Unexpected error loading directory.json; see logs for more details")
    }
})

// Rescan
app.get('/rescan/', (req, res) => {
    const {library: l, warnings: w, errors: e} = createLibrary(directories.collections_dirs, directories.single_dirs, directories.library_dirs)
    library = l; warnings = w; errors = e
    res.status(200).send(library)
})

// Get current playing filename
app.get('/status', (req, res) => {
    getStatus().then(status => res.status(200).json(status)).catch(error => {
        console.log(error); res.status(500).send("Error getting status; see logs for more details")
    })
})
// END: Endpoints for info

// BEGIN: Endpoints for controls
// Load a media by ID (index for single, or 3 comma-seperated indices for collection)
app.get('/load/:id', (req, res) => {
    let path
    if (req.params.id.includes(',')) {  // load a collection
        const indices = req.params.id.split(',').map(i => {
            const j = +i
            if (isNaN(j) || j < 0) {res.status(400).send(`${i} is not a valid positive integer`); return}
            else {return j}
        })
        if (indices.length !== 3) {res.status(400).send(`expected 3 indices, not ${indices.length}`); return}

        try {
            path = library[indices[0]]["items"][indices[1]][indices[2]]["path"]
        } catch {
            res.status(400).send(`invalid indices ${indices[0]}, ${indices[1]}, ${indices[2]}`); return
        }
        if (path === undefined) {res.status(400).send(`invalid first indices for size of library/collection`); return}

    } else { // load a single
        const index = +req.params.id
        if (isNaN(index) || index < 0 || index > library.length-1) {res.status(400).send(`${req.params.id} is not a valid index`); return}
        try {
            path = library[index]["item"]["path"]
        } catch {
            res.status(400).send(`invalid index ${index}`); return
        }
        if (path === undefined) {res.status(400).send(`invalid index for size of library`); return}
    }

    // Load path
    mpv.load(path).then(() => {
        res.status(200).send(`Successfully loaded id /${req.params.id}`);
    }).catch((error) => {
        if (error["errcode"] === 8) {res.status(401).send(`MPV is not running, make sure to GET /init first`)}
        else if (error["errcode"] === 0) {res.status(404).send(`Path ${path} not found`)}
        else {console.log(error); res.status(500).send(`error loading ID /${req.params[0]}; see logs for more details`)}
    })
})

// Toggle subtitles
// TODO

// Set volume
app.get('/volume/:volume', (req, res) => {
  mpv.volume(req.params.volume)
      .then(() => {
        res.status(200).send(`Successfully set volume`)
      }).catch((error) => {console.log(error); res.status(500).send(`Error setting volume; see logs for more details (did you GET /init?)`)})
})

// Play/pause
app.get('/playpause', (req, res) => {
    getStatus().then((status) => {
        if (!status.playing) {res.status(402).send("No file is playing")}
        else {
            mpv.togglePause()
                .then(() => {
                    res.status(200).send(`Successfully toggled play/pause`)
                }).catch((error) => {console.log(error); res.status(500).send(`Error toggling play/pause; see logs for more details`)})
        }
    })
})

// Stop
app.get('/stop', (req, res) => {
    getStatus().then((status) => {
        if (!status.playing) {res.status(402).send("No file is playing")}
        else {
            mpv.stop()
                .then(() => {
                    res.status(200).send(`Successfully stopped`)
                }).catch((error) => {console.log(error); res.status(500).send(`Error stopping; see logs for more details`)})
        }
    })
})

// Set timestamp
app.get('/timestamp/:timestamp', (req, res) => {
    getStatus().then((status) => {
        if (!status.playing) {res.status(402).send("No file is playing")}
        else {
            mpv.goToPosition(req.params.timestamp)
                .then(() => {
                    res.status(200).send(`Successfully set timestamp`)
                }).catch((error) => {console.log(error); res.status(500).send(`Error setting timestamp, see logs for more details`)})
        }
    })
})
// END: Endpoints for controls


// 404 middleware
const unknownEndpointMiddleware = (request, response) => {response.status(404).send({ error: 'unknown endpoint' })}
app.use(unknownEndpointMiddleware)

// HTTP server
const httpServer = http.createServer(app)
const PORT = 8945
const HOSTNAME = "0.0.0.0"
httpServer.listen(PORT, HOSTNAME, () => {
  console.log(`HTTP server running on port ${PORT}`)
})
