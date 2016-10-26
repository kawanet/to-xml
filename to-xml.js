/**
 * The toXML() method converts a JavaScript value to an XML string.
 *
 * @function toXML
 * @param value {Object} The value to convert to an XML string.
 * @param [replacer] {Function} A function that alters the behavior
 * of the stringification process.
 * @param [space] {Number|String} A String or Number object that's
 * used to insert white space into the output XML string for
 * readability purposes. If this is a Number, it indicates the number
 * of space characters to use as white space.
 * If this is a String, the string is used as white space.
 * @returns {String}
 */

var toXML;

(function(exports) {

  var TYPES = {
    "boolean": fromString,
    "number": fromString,
    "object": fromObject,
    "string": fromString
  };

  var ESCAPE = {
    "\t": "&#x09;",
    "\n": "&#x0a;",
    "\r": "&#x0d;",
    " ": "&#x20;",
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  };

  var LF = "\n";

  var isArray = Array.isArray || _isArray;

  exports.toXML = toXML = _toXML;

  function _toXML(value, replacer, space) {
    var job = createJob(replacer, space);
    fromAny(job, null, value);
    return job.r;
  }

  function createJob(replacer, space) {
    var job = {
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
      job.s = str;

      // indent string length
      job.i = str.length;
    }

    return job;
  }

  function fromAny(job, key, value) {
    if (_isArray(value)) return fromArray(job, key, value);

    var replacer = job.f;
    if (replacer) value = replacer(key, value);

    var f = TYPES[typeof value];
    if (f) f(job, key, value);
  }

  function fromString(job, key, value) {
    if (key === "?") {
      // XML declaration
      value = "<?" + value + "?>";
    } else if (key === "!") {
      // comment, CDATA section
      value = "<!" + value + ">";
    } else {
      value = escapeXML(value);
      if (key) {
        // text element without attributes
        value = "<" + key + ">" + value + "</" + key + ">";
      }
    }

    if (job.i) {
      // with indent
      job.r += job.l + value + LF;
    } else {
      // without indent
      job.r += value;
    }
  }

  function fromArray(job, key, value) {
    Array.prototype.forEach.call(value, function(value) {
      fromAny(job, key, value);
    });
  }

  function fromObject(job, key, value) {
    // empty tag
    var hasTag = !!key;
    if (value === null) {
      if (!hasTag) return;
      value = {};
    }

    var keys = Object.keys(value);
    var keyLength = keys.length;
    var attrs = keys.filter(isAttribute);
    var attrLength = attrs.length;
    var hasIndent = job.i;
    var incIndent = hasTag && hasIndent;

    // open tag
    if (hasTag) {
      if (hasIndent) job.r += job.l;
      job.r += '<' + key;

      // attributes
      attrs.forEach(function(name) {
        var val = value[name];

        if (isArray(val)) {
          val.forEach(setAttribute);
        } else {
          setAttribute(val);
        }

        function setAttribute(val) {
          var replacer = job.f;
          if (replacer) val = replacer(name, val);
          if ("undefined" === typeof val) return;

          // empty attribute name
          if (name === "@") {
            job.r += ' ' + val;
            return;
          }

          // attribute name
          job.r += ' ' + name.substr(1);

          // property attribute
          if (val === null) return;

          job.r += '="' + escapeXML(val) + '"';
        }
      });

      // empty element
      if (keyLength === attrLength) {
        job.r += "/>";
        if (hasIndent) job.r += LF;
        return;
      }

      job.r += '>';
      if (hasIndent) job.r += LF;
    }

    // increase indent level
    if (incIndent) {
      job.l += job.s;
    }

    // child nodes
    keys.forEach(function(name) {
      if (isAttribute(name)) return;
      fromAny(job, name, value[name]);
    });

    // decrease indent level
    if (incIndent) {
      job.l = job.l.substr(job.i);
    }

    // close tag
    if (hasTag) {
      if (hasIndent) job.r += job.l;
      job.r += '</' + key + '>';
      if (hasIndent) job.r += LF;
    }

    function isAttribute(name) {
      return name && name[0] === "@";
    }
  }

  function escapeXML(str) {
    return String.prototype.replace.call(str, /(^\s|[&<>"]|\s$)/g, function(str) {
      return ESCAPE[str] || str;
    });
  }

  function _isArray(array) {
    return array instanceof Array;
  }

})(typeof exports === 'object' && exports || {});
