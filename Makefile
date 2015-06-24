build: clean buildBrowser

buildBrowser:
	@mkdir -p dist/browser
	@./node_modules/.bin/browserify src/main.js -t babelify --outfile dist/browser/meyda.js
	@./node_modules/.bin/gulp minifyBuiltBrowserifyOutput

buildNode:
	@mkdir -p dist/node
	@./node_modules/.bin/gulp buildNode

test: build
	@./node_modules/.bin/mocha test

clean:
	@rm -rf dist dist.js
