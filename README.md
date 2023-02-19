# toXML - Pure JavaScript XML Writer

[![Node.js CI](https://github.com/kawanet/to-xml/workflows/Node.js%20CI/badge.svg?branch=main)](https://github.com/kawanet/to-xml/actions/)
[![npm version](https://badge.fury.io/js/to-xml.svg)](https://www.npmjs.com/package/to-xml)
[![gzip size](https://img.badgesize.io/https://unpkg.com/to-xml/dist/to-xml.min.js?compression=gzip)](https://unpkg.com/to-xml/dist/to-xml.min.js)

**Live Demo: [https://kawanet.github.io/from-xml/](https://kawanet.github.io/from-xml/)**

## FEATURES

- Simple: single writer function `toXML()` which returns XML string.
- Small: 2KB minified, 1KB gzipped.
- Standalone: no external module dependency nor DOM needed.
- TypeScript definition: [to-xml.d.ts](https://github.com/kawanet/to-xml/blob/master/to-xml.d.ts)

## SYNOPSIS

Node.js:

```js
const toXML = require("to-xml").toXML;
```

Browser:

```html
<script src="https://cdn.jsdelivr.net/npm/to-xml/dist/to-xml.min.js"></script>
```

Run:

```js
const data = {
  "xml": {
    "@foo": "FOO",
    "bar": {
      "baz": "BAZ"
    }
  }
};

const xml = toXML(data, null, 2);

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

JavaScript: null

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
  <qux></qux>
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

JavaScript: `#` property name

```json
{
  "xml": {
    "foo": {
      "@bar": "BAR",
      "#": "BAZ"
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

JavaScript: `?` and `!` property name

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

JavaScript: `#` property name

```json
{
  "plist": {
    "@version": "1.0",
    "dict": {
      "#": [
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

XML: child node list in order

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

## CLI

```sh
$ echo '{"foo":{"@bar":"BAR","buz":"BUZ"}}' | ./node_modules/.bin/json2xml -2
<foo bar="BAR">
  <buz>BUZ</buz>
</foo>
```

## LINKS

- https://github.com/kawanet/to-xml
- https://www.npmjs.com/package/from-xml
- https://www.npmjs.com/package/to-xml
- https://www.npmjs.com/package/xml-objtree

## LICENSE

The MIT License (MIT)

Copyright (c) 2016-2021 Yusuke Kawasaki

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
