test-codecov.io:
	istanbul cover ./node_modules/jasmine-node/bin/jasmine-node  --captureExceptions test/jasmine \
		&& cat ./coverage/coverage.json | ./node_modules/codecov.io/bin/codecov.io.js

deploy:
	$(eval VERSION := $(shell cat package.json | grep '"version"' | cut -d\" -f4))
	git tag v$(VERSION) -m ""
	git push origin v$(VERSION)
	npm publish