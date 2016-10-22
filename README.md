# toXML - JavaScript Object to XML

[![npm version](https://badge.fury.io/js/to-xml.svg)](http://badge.fury.io/js/to-xml) [![Build Status](https://travis-ci.org/kawanet/to-xml.svg?branch=master)](https://travis-ci.org/kawanet/to-xml)

## Features

- Simple: single function `toXML()` returns XML string.
- Small: 1.3KB minified. less than 1KB gziped.
- Pure JavaScript: No dependency nor DOM needed.
- Fast: try it, anyway.

## Usage

Node.js:

```js
var toXML = require("to-xml").toXML;
```

Browser:

```html
<script src="https://rawgit.com/kawanet/to-xml/master/dist/to-xml.min.js"></script>
````

JavaScript: `toXML()` returns the String.

```js
var xml = toXML({
  "xml": {
    "@foo": "FOO",
    "bar": "BAR"
  }
});
```

XML:

```xml
<xml foo="FOO"><bar>BAR</bar></xml>
```

### Pretty Printing

JavaScript: default indent level is 0.

```js
var xml = toXML({
  "xml": {
    "@foo": "FOO",
    "bar": "BAR"
  }
}, {indent: 2});
```

XML:

```xml
<xml foo="FOO">
  <bar>BAR</bar>
</xml>
````

### Empty Element

JavaScript: empty object

```js
var xml = toXML({
  "xml": {
    "foo": {"@bar": "BAR"},
    "buz": {},
    "qux": null,
    "quux": ""
  }
}, {indent: 2})
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

### Multiple Child Nodes

JavaScript: Array 

```js
var xml = toXML({
  "xml": {
    "foo": ["BAR", "BAZ", "QUX"]
  }
}, {indent: 2})
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
}, {indent: 2})
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
}, {indent: "\t"})
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

- [https://www.npmjs.com/package/to-xml](https://www.npmjs.com/package/to-xml)

### GitHub

- [https://github.com/kawanet/to-xml](https://github.com/kawanet/to-xml)

### XML.ObjTree

- [http://www.kawa.net/works/js/xml/objtree-e.html](http://www.kawa.net/works/js/xml/objtree-e.html)
- [https://www.npmjs.com/package/xml-objtree](https://www.npmjs.com/package/xml-objtree)

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
