build: clean buildWeb buildNode

buildWeb:
	@mkdir -p dist/web
	@./node_modules/.bin/browserify src/main.js -t babelify --outfile dist/web/meyda.js
	@./node_modules/.bin/gulp minifyBuiltBrowserifyOutput

buildNode:
	@mkdir -p dist/node
	@./node_modules/.bin/gulp buildNode

test: build
	@./node_modules/.bin/mocha test

clean:
	@rm -rf dist dist.js
