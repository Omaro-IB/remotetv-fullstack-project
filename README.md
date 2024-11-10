# remotetv-fullstack-project
Alternative Smart TV built on MPV, React, and NodeJS

## TODO
### Basics
 - [X] Design UI
 - [X] Create UI using React with basic player functionality
 - [X] Finish API for interacting with MPV player completely
 - [X] Use [PM2](https://stackoverflow.com/questions/5999373/how-do-i-prevent-node-js-from-crashing-try-catch-doesnt-work) to stop crashes

### Frontend
 - [X] Favicon 
 - [ ] Make media player look nicer
 - [X] Home page (prompt for search / browse library) and info button (copyright + how to use it + GitHub link)

### Backend
  - [ ] Use Server-Sent Events (SSE) (see [events.odt]) to update users' media player if any changes are made from another party
  - [X] Player should assume 1 second passes every second if playing / no seconds are passing if paused if no SSE)
  

### Plugins
 - [ ] Get plugins working with a Python class. Each plugin should be in its own folder along with a small thumbnail and any copyright info (maybe have a plugins page that let's you see this detailed info + install/uninstall). 
 

### Extra Stuff
 - [ ] Implement streaming support (everything works the same except instead of "download", its "stream" and adds a "stream box" to your library which includes stream URL and isteps
- [ ] Create an "installer" for Windows (.bat script), Linux (.sh), and Mac (also .sh) with clear and short steps 
- [ ] History functionality - have it display last-played in home page or a recommendation system based on frequency or something
- [ ] Under Info - more button that redirects to /info page with troubleshooting and FAQ
