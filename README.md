# remotetv-fullstack-project
Alternative Smart TV built on MPV, React, and NodeJS


## Documentation
### Install
1. Ensure you have installed: [mpv](https://mpv.io/installation/) and node (recommend using [node version manager](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating))
2. Run the following commands to clone the repository and install node dependencies
```bash
git clone https://github.com/Omaro-IB/remotetv-fullstack-project/
cd remotetv-fullstack-project/front/ && npm install && npm run build
cd ../back && npm install
```
3. Done!

### Usage
1. In `remotetv-fullstack-project/front/`, run `npm run preview -- --host` or `npm run preview -- --host --port 80` (requires admin)
2. In `remotetv-fullstack-project/back/`, run `node index.js [--collection path/to/directory/] [--single path/to/directory] [--library path/to/json] [--...]`
	  - Note that you may specify multiple `--collection`, `--single`, or `--library`
3. Visit one of the links shown in step 1. Ensure your firewall is not blocking port 4173 (or 80 if specified) or port 8945.

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
  "item_labels": [[String, ...], ...]: array of names of each item (ex. name of each episode). This must be equal in shape as "items",
  "global_img": String: valid path to image file (optional),
  "global_text": String: any details or description (optional),  
  "global_release": Number: release date (optional), 
  "global_quality": String: quality of the media (optional),  
  "global_language": String: language of the media (optional)
}
```

The library format is therefore specified as an array of singles or collections:
```json
[Single | Collection, ...]
```


### File organization for automatic scanning
Organization scheme support is quite flexible, with one of the (few) restrictions being that `single`s and `collection`s must be in separate folders (e.g. you must separate your movies and TV series). 

The following organizational structure is recommended, but other structures will likely work: 

#### Items
Each `item` (each episode, movie, song, etc. file) should ideally (but not required) be stored in its own folder, so that any associated subtitles, images, and [mediainfos](#media-info-files) may be stored with it.

#### Media info files
Each item (media file) can have `.mediainfo` files alongside any subtitles or images. These files specify text-based metadata to be displayed.

Additionally, `global.mediainfo` files can be stored in the root folder of any collection to be applied to the entire TV series, album, etc.

It is worth noting here that global images are also possible, stored in the same location as `global.png` (or any other supported image format).

Here is the structure of a media info file:
```json
{
   "text": String: any details or description (optional),
   "release": Number: release date (optional),
   "quality": String: quality of the media (optional),
   "language": String: language of the media (optional)
}
```

#### Single
Each single item should be stored in its own sub-directory alongside any other relevant files.
```
My Movies
  | Movie 1
    | Movie 1.mp4
    | Movie 1.srt
    | Movie 1.jpg
    | Movie 1.mediainfo
  | Movie 2
    | ...
  | ...
```

#### Collection with multiple groups (e.g. a TV series with multiple seasons)
Each collection should be in its own sub-directory, with groups in sub-sub-directories, and items in sub-sub-sub-directories alongside any other relevant files.
```
My TV
  | A TV Show
    | global.mediainfo
    | global.jpg
    | Season 1
      | Episode 1
        | Episode 1.mp4
        | Episode 1.srt
        | Episode 1.jpg
        | Episode 1.mediainfo
      | Episode 2
        | ...
      | ...
    | Season 2
      | ...
    | ...
  | ...
```

#### Collection with a single group (e.g. an album a single tracklist)
Each collection should be in its own sub-directory, with items in sub-sub-directories alongside any other relevant files.
```
My Albums
  | An album
    | global.mediainfo
    | global.jpg
    | Song 1
      | Song 1.mp3
      | Song 1.lrc
      | Song 1.jpg
      | Song 1.mediainfo
    | ...
  | ...
```


## TODO
### General
 - [x] Install, setup, and maintenance documentation
   - [x] Document backend CLI usage
   - [X] Document JSON library structure
   - [X] Document file structure for automatic scanning
 - [ ] Ability to queue entire collection groups to playlist
 - [ ] Ability to upload media files directly to server (+ option to fill out info manually and upload subs)
 - [X] Design UI
 - [X] Create UI using React with basic player functionality
 - [X] Finish API for interacting with MPV player completely
 - [X] Use [PM2](https://stackoverflow.com/questions/5999373/how-do-i-prevent-node-js-from-crashing-try-catch-doesnt-work) to stop crashes

### Frontend
 - [X] Library search
 - [X] Scanner page (errors and warnings & rescan button)
   - [X] Make look nicer
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
