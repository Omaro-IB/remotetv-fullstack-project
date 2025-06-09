# remotetv-fullstack-project
Alternative Smart TV built on MPV, React, and NodeJS

## TODO
### Basics
 - [ ] Install, setup, and maintenance documentation
   - [ ] Document backend CLI usage
   - [ ] Document JSON library structure
   - [ ] Document file structure for automatic scanning
 - [X] Design UI
 - [X] Create UI using React with basic player functionality
 - [X] Finish API for interacting with MPV player completely
 - [X] Use [PM2](https://stackoverflow.com/questions/5999373/how-do-i-prevent-node-js-from-crashing-try-catch-doesnt-work) to stop crashes

### Frontend
 - [ ] Sort by and filters for library
 - [ ] Scanner page
   - [ ] Errors: file paths that cannot be parsed (ex. ambiguous season number)
   - [ ] Warnings: missing non-critical information (ex. unknown metadata) 
   - [ ] Rescan library button
   - [ ] Option to auto rescan every $n$ minutes
 - [X] Subtitle button for media player
 - [X] Episode selector for TV shows
 - [X] Favicon 
 - [X] Make media player look nicer
 - [X] Home page and info button

### Backend
 - [X] Refactor codebase to support rescanning (using library in-memory instead of reading JSON file each time)
 - [ ] Library scanner
 - [X] Endpoint to rescan library - should update library in memory as well as errors/warnings
 - [X] Endpoint to toggle subtitles
 - [ ] Use Server-Sent Events (SSE) (see [events.odt]) to update users' media player if any changes are made from another device
 - [X] Player should assume (when no SSE events are sent) that 1 second passes every second if playing / no seconds are passing if paused
 
### Setup
 - [X] Easy way to specify single and series folder for scanner to search
 - [ ] Create an "installer" for Windows (.bat script), Linux (.sh), and Mac (also .sh) with clear and short steps 

### Extra Stuff
 - [ ] Under Info - more button that redirects to /info page with troubleshooting and FAQ
 - [ ] User experience: history, suggestions, random playback, favorites, playlists

### Known bugs
 - [ ] Initializing mpv (`/init/`) after manually terminating MPV on the server results in a crash
