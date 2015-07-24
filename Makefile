default: clean installDeps buildWeb buildNode test

build: buildWeb buildNode

buildWeb:
	@mkdir -p dist/web
	@./node_modules/.bin/gulp buildWeb
	@./node_modules/.bin/gulp uglifyWeb

buildNode:
	@mkdir -p dist/node
	@./node_modules/.bin/gulp buildNode

test: build lint coverage
	@./node_modules/.bin/mocha --recursive test

coverage:
	./node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha --recursive test --report lcovonly -- -R spec && cat ./coverage/lcov.info
	./node_modules/.bin/codeclimate-test-reporter < ./coverage/lcov.info

installDeps:
	@npm install

lint:
	@./node_modules/.bin/jshint src test

clean:
	@rm -rf dist node_modules src-cov coverage lib-cov
