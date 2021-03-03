# Changelog

## Pending
- System hourly stats logger - Fan Speed, CPU+MB Temp, Battery level
- Uptime session logger/shutdown script
- Add insta viewer
- Create a development system with API testing in browser, test scripts editing etc...
- Create social systems with twitter
- Create Security system to generate totp, github security alerts
- Add goto top button in Quartermaster

## Code Quality (Search Done)
- Convert all == to ===
- Add a testing system
- Add defualt value to EVERY variable
- Find eval alternative
- Remove all 'Var's indluding functions. They need to be scoped as objects/constructors
- Switch if arr.length>0 to if arr.length
- Convert all short names to proper names variables and functions
- Remove all comments as // tick and convert to /* tock */
- Remove all multiple e.style.property1, 2, 3..n and change combine them to one e.toggleclass
- Remove all trailing commas
- DOn't do i=0;i<a.length. It reads length repeatedly and is shit. Do. i=0,j=a.length;i<j; or predeclare
- Keep dom access to a minimum. Its really slow.
- Typecheck all data and add ranges and regexes where needed (input fields)

## Adding Tests
- Test for all functions return value. Made as many funcs return as possible
- Test for existance of == anywhere in code. All need to be ===
- Test for evals
- Test for vars. All need to be let and const


## v4.0.0 (In Progress | Ronin)
- News System
- Youtube Stores
- Bug Fixes


## v3.4.0

- Add search to JSON Multiple & Single
- Fix GMeet Bar remover and add ?bar=1 reader
- Add classes & formdata for simplicity


## v3.3.3

- Add Jupyter Controls
- Add CPU temp + fan speed Stats
- Watch tracker + src icons
- Glass JSON, remove talks
- Ditch Qwant
- Disphenoid Bug Fixes
- Glass Dashboard with Lazy Loading


## v3.3.0

- Add Quartermaster Extension
- Add json editor for multiple, single
- Add projects tracker
- Bug Fixes
- Dashboard: Add AppleScript connections to system for Music & Reminders
- Speed and other basic controls to Disphenoid
- Bug Fixes


## v3.1.0 & v3.2.0

- Full Merge DashBoard, started making structure cleaner, to work more efficiently 

- Add Lazy Loaded BG Image, still with lava lamp
- Remove a lot of useless shit


## v3.0.0 (Quartermaster)

- Full Merge Disphenoid into Sherlock
- Partially Get rid of Direct Google Usage


## v2.6.0

- Lava Lamp Random Backgrounds
- Minor Restructure for efficiency and speed


## v2.5.0

- Add vscode project links
- Minor Restructure for efficiency and speed
- (*2.5.1*) Add wallpaper


## v2.4.0

- Major performance improvements
- Remove favicon fetch, was slow and impractical at this stage
- Adding timer
- Add logo (Not very useful but sure)


## v2.2.0 & v2.3.0

- Added history logging
- Added beacon to send stat and added background stats calculations

- Adding github integration
- Add hyperlink to newton


## v2.1.0

- Engine now has less steps and is much simpler and faster
- Engine now has search suggestions (From Google Search API)


## v2.0.0 (Sherlock)

Full Convert to Svelte


## v1.0.0

Processing Engine for multiple sites with functions


## v0.0.0 (Chernobyl)

Simple new tab page written in vanillaJS