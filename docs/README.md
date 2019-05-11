## Meyda reference docs

Automatically generated reference documentation for the Meyda library.

## Usage

To build the reference docs from the annotations in the source code, run the following command in the root directoroy of the project.

```
$ npm run generatereferencedocs
```

To build the Javascript demo of Meyda that runs in the docs folder, run

```
$ cd docs
$ npm run build
```

To serve the docs locally

```
$ cd docs
$ bundle install
$ bundle exec jekyll serve
```

Make sure you're in the docs directory, have ruby and bundle installed on your machine, use bundle to install the dependencies (jekyll), and then use bundle to run jekyll's server.
