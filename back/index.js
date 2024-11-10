// BEGIN: Imports
const express = require('express')
const http = require('http')
const mpvAPI = require('node-mpv')
const {join} = require("node:path");
const fs = require('fs');
const cors = require('cors')
// END: Imports

// BEGIN: App initialization
const mpv = new mpvAPI({"verbose": true}, ["--fullscreen"])
const app = express()
app.use(express.json())
app.use(cors())
app.disable('etag')
const root_folder = "root"
const getStatus = () => {
    let status = {"playing": undefined, "resumed": undefined, "time": undefined, "endTime": undefined, "volume": undefined}
    let no_catches = true

    // Set "playing" = info of playing media (from directory.json)
    const promise1 = mpv.getProperty("path").then(path => {
        console.log("path", path)
        let library = JSON.parse(fs.readFileSync(join(root_folder, "directory.json"), 'utf8'))

        // Find the media that is playing, and its season/episode (if relevant) from path
        let playing = false
        let season = undefined
        let episode = undefined
        for (const media of library) {
            if (!(media.type === "tv")) {if (join(__dirname, root_folder, media.path) === path) {playing = media.id; break}}
            else {
                for (const s of Object.keys(media.episodes)) {
                    for (const e of Object.keys(media.episodes[s])) {
                        if (join(__dirname, root_folder, media.episodes[s][e]) === path) {playing = media.id; season = s; episode = e; break}
                    }
                }
            }
        }
        status["playing"] = library[playing]
        status["season"] = season
        status["episode"] = episode
    }).catch((_) => {no_catches = false})

    // Set "resumed" = true/false
    const promise2 = mpv.getProperty("core-idle").then(idle => {
        status["resumed"] = !idle
    }).catch((_) => {no_catches = false})

    // Set "time" = integer time
    const promise3 = mpv.getProperty("time-pos").then(time => {
        status["time"] = time
    }).catch((_) => {no_catches = false})

    // Set "endTime" = integer time
    const promise4 = mpv.getProperty("duration").then(endTime => {
        status["endTime"] = endTime
    }).catch((_) => {no_catches = false})

    // Set "volume" = integer volume
    const promise5 = mpv.getProperty("ao-volume").then(volume => {
        status["volume"] = volume
    }).catch((_) => {no_catches = false})

    return new Promise((resolve) => {
        Promise.all([promise1, promise2, promise3, promise4, promise5]).then(() => {
            if (no_catches) {resolve(status)}
            else {resolve({"playing": false, "resumed": undefined, "time": undefined, "endTime": undefined, "volume": undefined})}
        })
    })
}
// END: App initialization

// BEGIN: Endpoints for info
// Initialize MPV
app.get('/init', (req, res) => {
  mpv.start()
  .then(() => {
    res.status(200).send("Successfully started MPV")
  }).catch((error) => {
      if (error.errcode === 6) {res.status(400).send("Error starting MPV; MPV is already running")}
      else {console.log(error); res.status(500).send("Error starting MPV; See logs for more details")}
  })
})

// List library
app.get('/ls/', (req, res) => {
    try {
      let library = JSON.parse(fs.readFileSync(join(root_folder, "directory.json"), 'utf8'))
      res.status(200).json(library)
    } catch (error) {
      res.status(500).send("Unexpected error loading directory.json")
    }
})

// Get current playing filename
app.get('/status', (req, res) => {
    getStatus().then(status => res.status(200).json(status)).catch(error => {
        console.log(error); res.status(500).send("Error getting status; see logs for more details")
    })
})
// END: Endpoints for info

// BEGIN: Endpoints for controls
// Load a file
app.get('/load/:id', (req, res) => {
  let directory = JSON.parse(fs.readFileSync(join(root_folder, "directory.json"), 'utf8'))
  let filePath = directory.find(value => value.id === req.params.id).path
  if (filePath === undefined) {res.status(404).send({error: `ID ${req.params.id} not found`}); return}

  mpv.load(join(root_folder, filePath)).then(() => {
    res.status(200).send(`Successfully loaded id /${req.params.id}`)
  }).catch((error) => {
    if (error.errcode === 8) {res.status(401).send(`MPV is not running, make sure to GET /init first`)}
    else if (error.errcode === 0) {res.status(404).send(`Path ${filePath} not found`)}
    else {console.log(error); res.status(500).send(`error loading ID /${req.params[0]}; see logs for more details`)}
  })
})

app.get('/load/:id/:season/:episode', (req, res) => {
  let directory = JSON.parse(fs.readFileSync(join(root_folder, "directory.json"), 'utf8'))
  let filePath = directory.find(value => value.id === req.params.id).episodes[req.params.season][req.params.episode]
  if (filePath === undefined) {res.status(404).send({error: `ID ${req.params.id} not found`}); return}

  mpv.load(join(root_folder, filePath)).then(() => {
    res.status(200).send(`Successfully loaded id,season,episode /${req.params.id}/${req.params.season}/${req.params.episode}`)
  }).catch((error) => {
    if (error.errcode === 8) {res.status(401).send(`MPV is not running, make sure to GET /init first`)}
    else if (error.errcode === 0) {res.status(404).send(`Path ${filePath} not found`)}
    else {console.log(error); res.status(500).send(`error loading ID /${req.params.id}/${req.params.season}/${req.params.episode}; see logs for more details`)}
  })
})


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
