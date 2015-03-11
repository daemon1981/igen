REPORTER = dot

check: test

test:
	./node_modules/.bin/mocha $(T) \
		--recursive \
		--reporter $(REPORTER) \
		test \
		&& \
		jshint .

.PHONY: test