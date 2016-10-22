// to-xml.js

var toXML;

(function(exports) {
  var TYPES = {
    boolean: fromString,
    number: fromString,
    object: fromObject,
    string: fromString
  };

  var ESCAPE = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  };

  var LF = "\n";

  var PROTO = ToXML.prototype;
  PROTO.length = 1;
  PROTO[0] = ""; // result
  PROTO.l = ""; // current indent
  PROTO.s = ""; // indent per level
  PROTO.i = 0; // indent length

  exports.toXML = toXML = _toXML;

  function _toXML(input, options) {
    var toxml = new ToXML(options);
    (TYPES[typeof input] || ignore)(toxml, null, input);
    return toxml[0];
  }

  function ToXML(options) {
    var toxml = this;
    var indent = options && options.indent;
    if (indent) {
      var str = "";
      if (indent > 0) {
        for (var i = indent; i; i--) {
          str += " ";
        }
      } else {
        str += indent; // stringify
      }
      toxml.s = str;
      toxml.i = str.length;
    }
  }

  function fromString(toxml, tag, input) {
    input = entityEscape(input);
    if (tag) {
      input = "<" + tag + ">" + input + "</" + tag + ">";
    }
    if (toxml.i) {
      toxml[0] += toxml.l + input + LF;
    } else {
      toxml[0] += input;
    }
  }

  function fromArray(toxml, tag, input) {
    Array.prototype.forEach.call(input, function(input) {
      (TYPES[typeof input] || ignore)(toxml, tag, input);
    });
  }

  function fromObject(toxml, tag, input) {
    if (Array.isArray(input)) return fromArray(toxml, tag, input);

    var hasTag = !!tag;
    if (input === null) {
      if (!hasTag) return;
      input = {};
    }
    var keys = Object.keys(input);
    var attrs = keys.filter(isAttribute);
    var attrLength = attrs.length;
    var hasIndent = toxml.i;
    var incIndent = hasTag && hasIndent;

    // open tag
    if (hasTag) {
      if (hasIndent) toxml[0] += toxml.l;
      toxml[0] += '<' + tag;
      attrs.forEach(function(key) {
        var value = entityEscape(input[key]);
        toxml[0] += ' ' + key.substr(1) + '="' + value + '"';
      });

      // empty element
      if (keys.length === attrLength) {
        toxml[0] += "/>";
        if (hasIndent) toxml[0] += LF;
        return;
      }
      toxml[0] += '>';
      if (hasIndent) toxml[0] += LF;
    }

    // increase indent level
    if (incIndent) {
      toxml.l += toxml.s;
    }

    // child nodes
    keys.forEach(function(key) {
      if (isAttribute(key)) return;
      var value = input[key];
      (TYPES[typeof value] || ignore)(toxml, key, value);
    });

    // decrease indent level
    if (incIndent) {
      toxml.l = toxml.l.substr(toxml.i);
    }

    // close tag
    if (hasTag) {
      if (hasIndent) toxml[0] += toxml.l;
      toxml[0] += '</' + tag + '>';
      if (hasIndent) toxml[0] += LF;
    }

    function isAttribute(name) {
      return name && name[0] === "@";
    }
  }

  function entityEscape(str) {
    if ("string" !== typeof str) str += "";
    return str.replace(/([&<>"])/g, function(str) {
      return ESCAPE[str];
    });
  }

  function ignore() {
    // NOP
  }
})(typeof exports === 'object' && exports || {});
