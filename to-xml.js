// to-xml.js

var toXML;

(function(exports) {
  var TYPES = {
    "boolean": fromString,
    "number": fromString,
    "object": fromObject,
    "string": fromString
  };

  var ESCAPE = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  };

  var LF = "\n";

  exports.toXML = toXML = _toXML;

  function _toXML(value, replacer, space) {
    var buf = createBuffer(replacer, space);
    fromAny(buf, null, value);
    return buf.r;
  }

  function createBuffer(replacer, space) {
    var buf = {
      f: replacer, // replacer function
      // s: "", // indent string
      // i: 0, // indent string length
      l: "", // current indent string
      r: "" // result string
    };

    if (space) {
      var str = "";

      if (space > 0) {
        for (var i = space; i; i--) {
          str += " ";
        }
      } else {
        str += space; // stringify
      }
      buf.s = str;

      // indent string length
      buf.i = str.length;
    }

    return buf;
  }

  function fromAny(buf, tag, value) {
    var f = buf.f;
    if (f) value = f(tag, value); // replacer
    f = TYPES[typeof value];
    if (f) value = f(buf, tag, value);
  }

  function fromString(buf, tag, value) {
    if (tag === "?") {
      // XML declaration
      value = "<?" + value + "?>";
    } else if (tag === "!") {
      // comment, CDATA section
      value = "<!" + value + ">";
    } else {
      value = escapeXML(value);
      if (tag) {
        // text element without attributes
        value = "<" + tag + ">" + value + "</" + tag + ">";
      }
    }

    if (buf.i) {
      // with indent
      buf.r += buf.l + value + LF;
    } else {
      // without indent
      buf.r += value;
    }
  }

  function fromArray(buf, tag, value) {
    Array.prototype.forEach.call(value, function(value) {
      fromAny(buf, tag, value);
    });
  }

  function fromObject(buf, tag, value) {
    if (Array.isArray(value)) return fromArray(buf, tag, value);

    // empty tag
    var hasTag = !!tag;
    if (value === null) {
      if (!hasTag) return;
      value = {};
    }

    var keys = Object.keys(value);
    var keyLength = keys.length;
    var attrs = keys.filter(isAttribute);
    var attrLength = attrs.length;
    var hasIndent = buf.i;
    var incIndent = hasTag && hasIndent;

    // open tag
    if (hasTag) {
      if (hasIndent) buf.r += buf.l;
      buf.r += '<' + tag;

      // attributes
      attrs.forEach(function(key) {
        var val = value[key];

        // replacer
        var f = buf.f;
        if (f) val = f(key, val);
        if ("undefined" === typeof val) return;

        // attribute name
        buf.r += ' ' + key.substr(1);

        // property attribute
        if (val === null) return;

        buf.r += '="' + escapeXML(val) + '"';
      });

      // empty element
      if (keyLength === attrLength) {
        buf.r += "/>";
        if (hasIndent) buf.r += LF;
        return;
      }

      buf.r += '>';
      if (hasIndent) buf.r += LF;
    }

    // increase indent level
    if (incIndent) {
      buf.l += buf.s;
    }

    // child nodes
    keys.forEach(function(key) {
      if (isAttribute(key)) return;
      fromAny(buf, key, value[key]);
    });

    // decrease indent level
    if (incIndent) {
      buf.l = buf.l.substr(buf.i);
    }

    // close tag
    if (hasTag) {
      if (hasIndent) buf.r += buf.l;
      buf.r += '</' + tag + '>';
      if (hasIndent) buf.r += LF;
    }

    function isAttribute(name) {
      return name && name[0] === "@";
    }
  }

  function escapeXML(str) {
    if ("string" !== typeof str) str += "";
    return str.replace(/([&<>"])/g, function(str) {
      return ESCAPE[str];
    });
  }
})(typeof exports === 'object' && exports || {});
