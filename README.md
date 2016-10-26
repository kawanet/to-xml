# toXML - Pure JavaScript XML Writer

[![npm version](https://badge.fury.io/js/to-xml.svg)](http://badge.fury.io/js/to-xml) [![Build Status](https://travis-ci.org/kawanet/to-xml.svg?branch=master)](https://travis-ci.org/kawanet/to-xml)

**Live Demo: [https://kawanet.github.io/from-xml/](https://kawanet.github.io/from-xml/)**

## FEATURES

- Simple: single writer function `toXML()` which returns XML string.
- Small: less than 2KB minified, less than 1KB gzipped.
- Standalone: no external module dependency nor DOM needed.

## SYNOPSIS

Node.js:

```js
var toXML = require("to-xml").toXML;
```

Browser:

```html
<script src="https://rawgit.com/kawanet/to-xml/master/dist/to-xml.min.js"></script>
```

Run:

```js
var data = {
  "xml": {
    "@foo": "FOO",
    "bar": {
      "baz": "BAZ"
    }
  }
};

var xml = toXML(data, null, 2);

console.warn(xml);
```

Result:

```xml
<xml foo="FOO">
  <bar>
    <baz>BAZ</baz>
  </bar>
</xml>
```

## EXAMPLES

### Empty Element

JavaScript: null or empty object

```json
{
  "xml": {
    "foo": {"@bar": "BAR"},
    "buz": null,
    "qux": {},
    "quux": ""
  }
}
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

JavaScript: `@` property name or null value

```json
{
  "xml": {
    "@": "bar",
    "@baz": null,
    "foo": "FOO"
  }
}
```

XML: empty attribute

```xml
<xml bar baz>
    <foo>FOO</foo>
</xml>
```

### Multiple Child Nodes

JavaScript: Array of String or Array of Object

```json
{
  "xml": {
    "foo": ["BAR", "BAZ", "QUX"]
  }
}
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

```json
{
  "xml": {
    "foo": {
      "@bar": "BAR",
      "": "BAZ"
    }
  }
}
```

XML: text node

```xml
<xml>
  <foo bar="BAR">BAZ</foo>
</xml>
```

### XML Declaration and Comment

JavaScript: `?` and `!` as property name

```json
{
  "?": "xml version=\"1.0\"",
  "!": "DOCTYPE note SYSTEM \"Note.dtd\"",
  "note": {
    "title": "FOO",
    "!": "-- comment --",
    "body": "BAR"
  }
}
```

XML:

```xml
<?xml version="1.0"?>
<!DOCTYPE note SYSTEM "Note.dtd">
<note>
  <title>FOO</title>
  <!-- comment -->
  <body>BAR</body>
</note>
```

### Fragment

JavaScript: empty property name with Array value

```json
{
  "plist": {
    "@version": "1.0",
    "dict": {
      "": [
        {"key": "CFBundleDevelopmentRegion"},
        {"string": "ja"},
        {"key": "CFBundleIcons"},
        {"dict": null},
        {"key": "LSRequiresIPhoneOS"},
        {"true": null}
      ]
    }
  }
}
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

### Tests

- [https://kawanet.github.io/from-xml/](https://kawanet.github.io/from-xml/)
- [https://travis-ci.org/kawanet/to-xml](https://travis-ci.org/kawanet/to-xml)
- [https://rawgit.com/kawanet/to-xml/master/test/test.html](https://rawgit.com/kawanet/to-xml/master/test/test.html)

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
