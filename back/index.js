// BEGIN: Imports
const express = require('express')
const http = require('http')
const mpvAPI = require('node-mpv')
const {join} = require("node:path");
const fs = require('fs');
const cors = require('cors')
const { spawnSync } = require('child_process');
// END: Imports

// BEGIN: App initialization
const mpv = new mpvAPI({"verbose": true}, ["--fullscreen"])
const app = express()
app.use(express.json())
app.use(cors())
app.disable('etag')
const root_folder = "root"
const getStatus = () => {
    const SERIES_TYPES = ["tv", "album", "podcast"]
    let status = {"playing": undefined, "resumed": undefined, "time": undefined, "endTime": undefined, "volume": undefined}
    let no_catches = true

    // Set "playing" = info of playing media (from directory.json)
    const promise1 = mpv.getProperty("path").then(path => {
        let library = JSON.parse(fs.readFileSync(join(root_folder, "directory.json"), 'utf8'))

        // Find the media that is playing, and its season/episode (if relevant) from path
        for (const media of  library) {
            if (!(SERIES_TYPES.includes(media.type))) {if (join(__dirname, root_folder, media.path) === path) {status["playing"] = media; break}}
            else {
                for (const s of Object.keys(media.episodes)) {
                    for (const e of Object.keys(media.episodes[s])) {
                        if (join(__dirname, root_folder, media.episodes[s][e]) === path) {status["playing"] = media; status["season"] = s; status["episode"] = e; break}
                    }
                }
            }
        }
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

// BEGIN: Endpoints for plugins
app.get('/plugins', (req, res) => {
    fs.readdir("plugins", (err, files) => {
        if (err) {
            res.status(500).send("Error getting plugin info, see logs for more details.")
            console.log(err);
        } else {
            res.status(200).json(files.filter(x => (x !== ".idea" && x !== "__init__.py" && x !== "__pycache__" && x !== "core")))
        }
    });
})

app.get('/plugins/thumbnail/:id', (req, res) => {
    const options = {
        root: join(__dirname)
    };

    res.sendFile(join("plugins", req.params.id, "thumbnail.png"), options, function (err) {
        if (err) {
            res.status(404).send(`plugin "${req.params.id}" not found`)
        }
    });
});

app.get('/plugins/search/:id', async (req, res) => {
    if (!req.query.q) {res.status(400).send("No query found (use ?q=...)")}
    else {
        // Get result from python script
        const pythonProcess = await spawnSync("python3", [
            "-m", `plugins.${req.params.id}.plugin`, "SEARCH", req.query.p
        ]);
        res.status(200).send(pythonProcess.stdout?.toString()?.trim()?.split("\n"));
    }
})

app.get('/plugins/download/:id', async (req, res) => {
    if (!req.query.s) {res.status(400).send("No source found (use ?s=...)")}
    else {
        // Get result from python script
        const pythonProcess = await spawnSync("python3", [
            "-m", `plugins.${req.params.id}.plugin`, "DOWNLOAD", req.query.s
        ]);
        const result = pythonProcess.stdout?.toString()?.trim()?.split("\n\n");
        res.status(200).send(result[result.length - 1]);
    }
})
// END: Endpoints for plugins

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
