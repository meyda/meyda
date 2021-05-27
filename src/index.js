/*
This file is used as the entry point for only the web builds of Meyda. It is
*not* used as the entrypoint for the node build of Meyda. It makes sure that
Meyda directly exports itself on those builds, rather than the es6 default
export. The entrypoint of the node build of Meyda is `main.js`.
*/
module.exports = require("./main").default;
