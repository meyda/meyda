build:
	@./node_modules/.bin/gulp

test: build
	@./node_modules/.bin/mocha test
