#!/usr/bin/env bash -c make

SRC=./to-xml.js
TESTS=*.json ./test/*.js
HINTS=$(SRC) $(TESTS)
DIST=./dist
JSDEST=./dist/to-xml.min.js
JSGZIP=./dist/to-xml.min.js.gz

all: test $(JSGZIP)

clean:
	rm -fr $(DIST)

$(DIST):
	mkdir -p $(DIST)

$(JSDEST): $(SRC) $(DIST)
	./node_modules/.bin/terser $(SRC) -c -m -o $(JSDEST)

$(JSGZIP): $(JSDEST)
	gzip -9 < $(JSDEST) > $(JSGZIP)
	ls -l $(JSDEST) $(JSGZIP)

test: jshint mocha

mocha:
	./node_modules/.bin/mocha -R spec $(TESTS)

jshint:
	./node_modules/.bin/jshint $(HINTS)

.PHONY: all clean test jshint mocha
