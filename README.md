# Meyda Showcase Site

This is a website to showcase the Meyda Audio Feature Extraction library for Node.js and web audio.

## Usage

The site is mostly static, so you can serve with `python -m SimpleHTTPServer` (or a similar command which you can find using Google for Python3). The one caveat is that our Javascript must be browserified, as we split the files out for modularization. I use `watchify` to monitor our single entry point js file (`src/main.js`) and build our served js file `./main.js`. Command would be as follows:

```
$ # installs the watchify utility from NPM
$ npm install -g watchify
$ # watches the file and browserifies upon changes
$ watchify src/main.js -o main.js
```
