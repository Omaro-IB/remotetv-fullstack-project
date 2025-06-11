# remotetv-fullstack-project
Alternative Smart TV built on MPV, React, and NodeJS


## Documentation
### Install
TODO...

### Usage
TODO...

### Library JSON file format
JSON library files may be specified with the `--library` option to manually specify (as opposed to relying on automatic file scanning) files, their metadata, and type.

A library file must follow a strict format. It consists of a root array of `collection` and `single` objects. A `collection` is a collection of related media files (ex. tv series or album), while a `single` is a single media file (ex. movie or single song). These both use `item` objects to specify file paths, their metadata, and type.

An `item` is specified as:
```json
{
  "path": String: valid path to media file,
  "img": String: valid path to image file (optional),
  "sub": String: valid path to subtitle or lyrics file (optional),
  "text": String: any details or description (optional),
  "release": Number: release date (optional),
  "quality": String: quality of the media (optional),
  "language": String: language of the media (optional)
}
```

A `single` is specified as:
```json
{
  "name": String,
  "item": Item
}
```

A `collection` is specified as:
```json
{
  "name": String,
  "items": [[Item, ...], ...]: nested array of Item objects (each inner array may be a season of a TV series for example),
  "group_labels": [String]: array of names of each group (ex. Season1, Season2, etc.). This must be equal in length as "items"
  "item_labels": [[String, ...], ...]: array of names of each item (ex. name of each episode). This must be equal in shape as "items"
}
```

The library format is therefore specified as:
```json
[Single | Collection, ...]
```


### File organization for automatic scanning
TODO...


## TODO
### General
 - [ ] Install, setup, and maintenance documentation
   - [ ] Document backend CLI usage
   - [X] Document JSON library structure
   - [ ] Document file structure for automatic scanning
 - [ ] Ability to queue entire collection groups to playlist
 - [ ] Ability to upload media files directly to server (+ option to fill out info manually and upload subs)
 - [X] Design UI
 - [X] Create UI using React with basic player functionality
 - [X] Finish API for interacting with MPV player completely
 - [X] Use [PM2](https://stackoverflow.com/questions/5999373/how-do-i-prevent-node-js-from-crashing-try-catch-doesnt-work) to stop crashes

### Frontend
 - [ ] Sort by and filters for library
 - [X] Scanner page (errors and warnings & rescan button)
   - [ ] Make look nicer
   - [ ] Option to auto rescan every $n$ minutes
 - [X] Subtitle button for media player
 - [X] Episode selector for TV shows
 - [X] Favicon 
 - [X] Make media player look nicer
 - [X] Home page and info button

### Backend
 - [X] Refactor codebase to support rescanning (using library in-memory instead of reading JSON file each time)
 - [X] Library scanner
 - [X] Endpoint to rescan library - should update library in memory as well as errors/warnings
 - [X] Endpoint to toggle subtitles
 - [ ] Use Server-Sent Events (SSE) (see [events.odt]) to update users' media player if any changes are made from another device
 - [X] Player should assume (when no SSE events are sent) that 1 second passes every second if playing / no seconds are passing if paused
 
### Setup
 - [X] Easy way to specify single and series folder for scanner to search
 - [ ] Create an "installer" for Windows (.bat script), Linux (.sh), and Mac (also .sh) with clear and short steps 
 - [ ] Create a launch script for easy use that also synchronizes port numbers to avoid hard-coding

### Extra Stuff
 - [ ] Under Info - more button that redirects to /info page with troubleshooting and FAQ
 - [ ] User experience: history, suggestions, random playback, favorites, playlists

### Known bugs
 - [ ] Initializing mpv (`/init/`) after manually terminating MPV on the server results in a crash
