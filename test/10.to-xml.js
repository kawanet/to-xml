// #!/usr/bin/env mocha -R spec

/* jshint mocha:true */
/* jshint browser:true */
/* globals JSON */

var exported = ("undefined" !== typeof require) ? require("../") : window;
var toXML = exported.toXML;

assert.equal = equal;
assert.ok = assert;

var UNDEFINED;

function assert(value) {
  if (!value) throw new Error(value + " = " + true);
}

function equal(actual, expected) {
  if (actual != expected) throw new Error(actual + " = " + expected);
}

describe("toXML", function() {
  it("string", function() {
    assert.equal(toXML({xml: "string"}), '<xml>string</xml>');
  });

  it("number", function() {
    assert.equal(toXML({xml: 0}), '<xml>0</xml>');
    assert.equal(toXML({xml: 1}), '<xml>1</xml>');
    assert.equal(toXML({xml: -1}), '<xml>-1</xml>');
  });

  it("boolean", function() {
    assert.equal(toXML({xml: true}), '<xml>true</xml>');
    assert.equal(toXML({xml: false}), '<xml>false</xml>');
  });

  it("object", function() {
    assert.equal(toXML({a: {b: "B"}}), '<a><b>B</b></a>');
    assert.equal(toXML({a: {b: "B", c: "C"}}), '<a><b>B</b><c>C</c></a>');
  });

  it("empty element", function() {
    assert.equal(toXML({xml: {undef: UNDEFINED}}), '<xml></xml>'); // ignored
    assert.equal(toXML({xml: {"null": null}}), '<xml><null/></xml>'); // empty element
    assert.equal(toXML({xml: {object: {}}}), '<xml><object/></xml>'); // empty element
    assert.equal(toXML({xml: {string: ""}}), '<xml><string></string></xml>');
  });

  it("attributes", function() {
    assert.equal(toXML({a: {"@b": "B"}}), '<a b="B"/>');
    assert.equal(toXML({a: {"@b": "B", "@c": "C"}}), '<a b="B" c="C"/>');
    assert.equal(toXML({a: {"@b": "B", c: "C"}}), '<a b="B"><c>C</c></a>');
    assert.equal(toXML({a: {"@b": "B", "": "C"}}), '<a b="B">C</a>');
    assert.equal(toXML({a: {"@b": UNDEFINED}}), '<a/>');
    assert.equal(toXML({a: {"@b": null}}), '<a b/>');
    assert.equal(toXML({a: {"@b": null, "": "C"}}), '<a b>C</a>');
    assert.equal(toXML({a: {"@b": ["B", "C"]}}), '<a b="B" b="C"/>');
    assert.equal(toXML({a: {"@b": [UNDEFINED, UNDEFINED]}}), '<a/>');
  });

  it("empty attribute name", function() {
    // it has a bare string which is not escaped
    assert.equal(toXML({foo: {"@": "FOO"}}), '<foo FOO/>');
    assert.equal(toXML({foo: {"@": "&"}}), '<foo &/>');

    // it has a list of bare strings which is not escaped
    assert.equal(toXML({foo: {"@": ["FOO", "BAR"]}}), '<foo FOO BAR/>');
    assert.equal(toXML({foo: {"@": ["&", "&"]}}), '<foo & &/>');

    // it has a set of attributes
    assert.equal(toXML({foo: {"@": {"foo": "FOO"}}}), '<foo foo="FOO"/>');
    assert.equal(toXML({foo: {"@": {"foo": ["FOO", "BAR"]}}}), '<foo foo="FOO" foo="BAR"/>');

    // it has a list of attributes
    assert.equal(toXML({foo: {"@": [{"foo": "FOO"}]}}), '<foo foo="FOO"/>');
    assert.equal(toXML({foo: {"@": [{"foo": "FOO"}, "BAR"]}}), '<foo foo="FOO" BAR/>');
    assert.equal(toXML({foo: {"@": [{"foo": ["FOO", "BAR"]}, "BAZ"]}}), '<foo foo="FOO" foo="BAR" BAZ/>');
  });

  it("array", function() {
    assert.equal(toXML({ul: {li: []}}), '<ul></ul>');
    assert.equal(toXML({ul: {li: [{span: "foo"}, {span: "bar"}]}}), '<ul><li><span>foo</span></li><li><span>bar</span></li></ul>');
    assert.equal(toXML({ul: {li: ["", "string", 0, true]}}), '<ul><li></li><li>string</li><li>0</li><li>true</li></ul>');
    assert.equal(toXML({ul: {li: [UNDEFINED, UNDEFINED]}}), '<ul></ul>');
  });

  it("fragment", function() {
    assert.equal(toXML({a: {"": [{b: "B"}, {c: 0}, {d: true}, {e: {}}]}}), '<a><b>B</b><c>0</c><d>true</d><e/></a>');
    assert.equal(toXML({a: {"": ["B", {c: "C"}, "D"]}}), '<a>B<c>C</c>D</a>');
  });

  it('comment', function() {
    assert.equal(toXML({foo: {"!": "bar"}}),
      '<foo><!bar></foo>');
    assert.equal(toXML({foo: {"!": "--bar--"}}),
      '<foo><!--bar--></foo>');
    assert.equal(toXML({foo: {"!": ["bar", "baz"]}}),
      '<foo><!bar><!baz></foo>');
    assert.equal(toXML({foo: {"!": ["--bar--", "--baz--"]}}),
      '<foo><!--bar--><!--baz--></foo>');
    assert.equal(toXML({foo: {"!": ["bar", "--baz--"]}}),
      '<foo><!bar><!--baz--></foo>');
    assert.equal(toXML({foo: {"!": '--L<G>A&Q"--'}}),
      '<foo><!--L<G>A&Q"--></foo>');
  });

  it('xml declaration', function() {
    assert.equal(toXML({"?": 'xml version="1.1"'}), '<?xml version="1.1"?>');

    var res = '<?xml version="1.0"?>' +
      '<!DOCTYPE foo SYSTEM "foo.dtd">' +
      '<foo>FOO</foo>';

    assert.equal(toXML({
      "?": 'xml version="1.0"',
      "!": 'DOCTYPE foo SYSTEM "foo.dtd"',
      "foo": "FOO"
    }), res);

    assert.equal(toXML({
      "": [
        {"?": 'xml version="1.0"'},
        {"!": 'DOCTYPE foo SYSTEM "foo.dtd"'},
        {"foo": "FOO"}
      ]
    }), res);
  });

  it("indent", function() {
    // 1 space
    assert.equal(toXML({xml: "string"}, null, 1), "<xml>string</xml>");
    assert.equal(toXML({a: {b: "B"}}, null, 1), "<a>\n <b>B</b>\n</a>");
    assert.equal(toXML({a: {b: {c: "C"}}}, null, 1), "<a>\n <b>\n  <c>C</c>\n </b>\n</a>");

    // 2 spaces
    assert.equal(toXML({xml: "string"}, null, 2), "<xml>string</xml>");
    assert.equal(toXML({a: {b: "B"}}, null, 2), "<a>\n  <b>B</b>\n</a>");
    assert.equal(toXML({a: {b: {c: "C"}}}, null, 2), "<a>\n  <b>\n    <c>C</c>\n  </b>\n</a>");

    // tab
    assert.equal(toXML({xml: "string"}, null, "\t"), "<xml>string</xml>");
    assert.equal(toXML({a: {b: "B"}}, null, "\t"), "<a>\n\t<b>B</b>\n</a>");
    assert.equal(toXML({a: {b: {c: "C"}}}, null, "\t"), "<a>\n\t<b>\n\t\t<c>C</c>\n\t</b>\n</a>");

    // indent with attribute
    assert.equal(toXML({"foo": {"@bar": "BAR", "": "FOO"}}, null, 1), '<foo bar="BAR">FOO</foo>');

    // indent with comment
    assert.equal(toXML({"?": "xml", "!": "-- --", "xml": "string"}, null, 1),
      '<?xml?>\n<!-- -->\n<xml>string</xml>');
    assert.equal(toXML({"a": {"!": "-- --"}}, null, 1),
      '<a>\n <!-- -->\n</a>');
    assert.equal(toXML({"a": {"b": "B", "!": "-- --", "c": "C"}}, null, 1),
      '<a>\n <b>B</b>\n <!-- -->\n <c>C</c>\n</a>');

    // indent with fragment
    // assert.equal(toXML({"foo": {"": ["FOO", "FOO"]}}, null, 1), '<foo>\n FOOFOO\n</foo>');
  });

  it("escape", function() {
    // text node escapes 3 characters: &, <, >
    assert.equal(toXML({xml: 'L<G>A&Q"'}), '<xml>L&lt;G&gt;A&amp;Q"</xml>');

    // attribute escapes 2 characters: &, "
    assert.equal(toXML({xml: {"@attr": 'L<G>A&Q"'}}), '<xml attr="L<G>A&amp;Q&quot;"/>');

    // tag and attribute name not escaped
    assert.equal(toXML({"&": {"@&": "&", "": "&"}}), '<& &="&amp;">&amp;</&>');
  });

  it("whitespace", function() {
    assert.equal(toXML({xml: " F O O "}), '<xml>&#x20;F O O&#x20;</xml>');
    assert.equal(toXML({xml: "\tF\tO\tO\t"}), '<xml>&#x09;F\tO\tO&#x09;</xml>');
    assert.equal(toXML({xml: "\rF\nO\rO\n"}), '<xml>&#x0d;F\nO\rO&#x0a;</xml>');
  });

  it("replacer", function() {
    // replacer which may return modified string
    assert.equal(JSON.stringify({foo: {"bar": "BAR", "baz": "BAZ"}}, bazLower),
      '{"foo":{"bar":"BAR","baz":"baz"}}');
    assert.equal(toXML({foo: {"bar": "BAR", "baz": "BAZ"}}, bazLower),
      '<foo><bar>BAR</bar><baz>baz</baz></foo>');
    assert.equal(toXML({foo: {"baz": ["BAZ-1", "BAZ-2"]}}, bazLower),
      '<foo><baz>baz-1</baz><baz>baz-2</baz></foo>');
    assert.equal(toXML({foo: {"@bar": "BAR", "@baz": "BAZ"}}, bazLower),
      '<foo bar="BAR" baz="baz"/>');
    assert.equal(toXML({foo: {"@baz": ["BAZ-1", "BAZ-2"]}}, bazLower),
      '<foo baz="baz-1" baz="baz-2"/>');

    function bazLower(key, val) {
      if (key && key.indexOf("baz") > -1) {
        return String.prototype.toLowerCase.call(val);
      }
      return val;
    }

    // replacer which may return undefined
    assert.equal(JSON.stringify({foo: {"bar": "BAR", "baz": "BAZ"}}, barIgnore),
      '{"foo":{"baz":"BAZ"}}');
    assert.equal(toXML({foo: {"bar": "BAR", "baz": "BAZ"}}, barIgnore),
      '<foo><baz>BAZ</baz></foo>');
    assert.equal(toXML({foo: {"bar": ["BAR-1", "BAR-2"], "baz": "BAZ"}}, barIgnore),
      '<foo><baz>BAZ</baz></foo>');
    assert.equal(toXML({foo: {"@bar": "BAR", "@baz": "BAZ"}}, barIgnore),
      '<foo baz="BAZ"/>');
    assert.equal(toXML({foo: {"@bar": ["BAR-1", "BAR-2"], "@baz": "BAZ"}}, barIgnore),
      '<foo baz="BAZ"/>');

    function barIgnore(key, val) {
      if (key && key.indexOf("bar") > -1) return; // undefined
      return val;
    }

    // replacer should work before escaped
    assert.equal(toXML({"foo": {"baz": 'l<g>a&q"'}}, bazUpper),
      '<foo><baz>L&lt;G&gt;A&amp;Q"</baz></foo>');
    assert.equal(toXML({"foo": {"@baz": 'l<g>a&q"'}}, bazUpper),
      '<foo baz="L<G>A&amp;Q&quot;"/>');

    function bazUpper(key, val) {
      if (key && key.indexOf("baz") > -1) {
        return String.prototype.toUpperCase.call(val);
      }
      return val;
    }

    // replacer which replaces Date object
    if (Date.prototype.toJSON) {
      var dtJSON = (new Date(2016, 9, 26, 21, 28, 0)).toJSON();
      var date = new Date(dtJSON); // 2016-10-26T12:28:00.000Z
      assert.equal(JSON.stringify({"foo": date}, dateReplacer),
        '{"foo":"' + dtJSON + '"}');
      assert.equal(toXML({"foo": {"@date": date, "bar": date}}, dateReplacer),
        '<foo date="' + dtJSON + '"><bar>' + dtJSON + '</bar></foo>');
    }

    function dateReplacer(key, val) {
      return (val instanceof Date) ? val.toJSON() : val;
    }
  });
});
