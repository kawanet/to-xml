#!/usr/bin/env bash -c make

SRC=./to-xml.js
TESTS=./test/*.js
HINTS=$(SRC) $(TESTS)
DIST=./dist
JSDEST=./dist/to-xml.min.js
JSGZIP=./dist/to-xml.min.js.gz
ESM=./dist/to-xml.mjs

all: $(ESM) $(JSDEST) $(JSGZIP)

clean:
	rm -fr $(DIST)

$(JSDEST): $(SRC)
	@mkdir -p dist
	./node_modules/.bin/terser -c -m -o $@ -- $<

$(JSGZIP): $(JSDEST)
	gzip -9 < $< > $@
	ls -l $< $@

$(ESM): $(SRC)
	@mkdir -p dist
	cp -p $< $@
	perl -i -pe 's#^var (toXML =)#export const $$1#' $@
	perl -i -pe 's#typeof exports[^)]+#{}#' $@

test: all jshint mocha
	node -e 'import("./dist/to-xml.mjs").then(x => console.log(x.toXML({ok:null})))'
	node -e 'console.log(require("./dist/to-xml.min.js").toXML({ok:null}))'

mocha:
	./node_modules/.bin/mocha -R spec $(TESTS)

jshint:
	./node_modules/.bin/jshint $(HINTS)

.PHONY: all clean test jshint mocha
