test-codecov.io:
	istanbul cover ./node_modules/jasmine-node/bin/jasmine-node  --captureExceptions test/jasmine \
		&& cat ./coverage/coverage.json | ./node_modules/codecov.io/bin/codecov.io.js