# toXML - Pure JavaScript XML Writer

[![npm version](https://badge.fury.io/js/to-xml.svg)](http://badge.fury.io/js/to-xml) [![Build Status](https://travis-ci.org/kawanet/to-xml.svg?branch=master)](https://travis-ci.org/kawanet/to-xml)

Live Demo: [https://kawanet.github.io/from-xml/](https://kawanet.github.io/from-xml/)

## Features

- Simple: single writer function `toXML()` which returns XML string.
- Small: less than 2KB minified, less than 1KB gzipped.
- Standalone: no external module dependency nor DOM needed.

## Usage

Node.js:

```js
var toXML = require("to-xml").toXML;
```

Browser:

```html
<script src="https://rawgit.com/kawanet/to-xml/master/dist/to-xml.min.js"></script>
```

JavaScript: `toXML()` returns the String.

```js
var xml = toXML({
  "xml": {
    "@foo": "FOO",
    "bar": {
      "baz": "BAZ"
    }
  }
});
```

XML:

```xml
<xml foo="FOO"><bar><baz>BAZ</baz></bar></xml>
```

### Pretty Printing

JavaScript: default indent level is 0.

```js
var xml = toXML({
  "xml": {
    "@foo": "FOO",
    "bar": {
      "baz": "BAZ"
    }
  }
}, null, 2);
```

XML:

```xml
<xml foo="FOO">
  <bar>
    <baz>BAZ</baz>
  </bar>
</xml>
```

### Empty Element

JavaScript: null

```js
var xml = toXML({
  "xml": {
    "foo": {"@bar": "BAR"},
    "buz": null,
    "qux": {},
    "quux": ""
  }
}, null, 2)
```

XML: empty element

```xml
<xml>
  <foo bar="BAR"/>
  <buz/>
  <qux/>
  <quux></quux>
</xml>
```

### Empty Attribute

JavaScript: null

```js
var xml = toXML({
  "xml": {
    "@bar": null,
    "foo": "FOO"
  }
}, null, 2)
```

XML: empty attribute

```xml
<xml bar>
  <foo>FOO</foo>
</xml>
```

### Multiple Child Nodes

JavaScript: Array 

```js
var xml = toXML({
  "xml": {
    "foo": ["BAR", "BAZ", "QUX"]
  }
}, null, 2)
```

XML: child nodes

```xml
<xml>
  <foo>BAR</foo>
  <foo>BAZ</foo>
  <foo>QUX</foo>
</xml>
```

### Text Node with Attribute

JavaScript: empty property name with String value

```js
var xml = toXML({
  "xml": {
    "foo": {
      "@bar": "BAR",
      "": "BAZ"
    }
  }
}, null, 2)
```

XML: text node

```xml
<xml>
  <foo bar="BAR">
    BAZ
  </foo>
</xml>
```

### Fragment

JavaScript: empty property name with Array value

```js
var xml = toXML({
  "plist": {
    "@version": "1.0",
    "dict": {
      "": [
        {"key": "CFBundleDevelopmentRegion", "string": "ja"},
        {"key": "CFBundleIcons", "dict": null},
        {"key": "LSRequiresIPhoneOS", "true": null}
      ]
    }
  }
}, null, "\t")
```

XML: child nodes in order

```xml
<plist version="1.0">
	<dict>
		<key>CFBundleDevelopmentRegion</key>
		<string>ja</string>
		<key>CFBundleIcons</key>
		<dict/>
		<key>LSRequiresIPhoneOS</key>
		<true/>
	</dict>
</plist>
```

## SEE ALSO

### NPM

- [https://www.npmjs.com/package/from-xml](https://www.npmjs.com/package/from-xml) - XML Parser
- [https://www.npmjs.com/package/to-xml](https://www.npmjs.com/package/to-xml) - XML Writer
- [https://www.npmjs.com/package/xml-objtree](https://www.npmjs.com/package/xml-objtree)

### GitHub

- [https://github.com/kawanet/to-xml](https://github.com/kawanet/to-xml)

## LICENSE

The MIT License (MIT)

Copyright (c) 2016 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
