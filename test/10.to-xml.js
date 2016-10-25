// #!/usr/bin/env mocha -R spec

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

  it("empty", function() {
    assert.equal(toXML({xml: {undef: UNDEFINED}}), '<xml></xml>'); // ignored
    assert.equal(toXML({xml: {null: null}}), '<xml><null/></xml>'); // empty element
    assert.equal(toXML({xml: {object: {}}}), '<xml><object/></xml>'); // empty element
    assert.equal(toXML({xml: {string: ""}}), '<xml><string></string></xml>');
  });

  it("attr", function() {
    assert.equal(toXML({a: {"@b": "B"}}), '<a b="B"/>');
    assert.equal(toXML({a: {"@b": "B", "@c": "C"}}), '<a b="B" c="C"/>');
    assert.equal(toXML({a: {"@b": "B", c: "C"}}), '<a b="B"><c>C</c></a>');
    assert.equal(toXML({a: {"@b": "B", "": "C"}}), '<a b="B">C</a>');
    assert.equal(toXML({a: {"@b": null}}), '<a b/>');
    assert.equal(toXML({a: {"@b": null, "": "C"}}), '<a b>C</a>');
  });

  it("array", function() {
    assert.equal(toXML({ul: {li: ["", "string", 0, true]}}), '<ul><li></li><li>string</li><li>0</li><li>true</li></ul>');
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
    assert.equal(toXML({xml: "string"}, null, 1), "<xml>string</xml>\n");
    assert.equal(toXML({a: {b: "B"}}, null, 1), "<a>\n <b>B</b>\n</a>\n");
    assert.equal(toXML({a: {b: {c: "C"}}}, null, 1), "<a>\n <b>\n  <c>C</c>\n </b>\n</a>\n");
    assert.equal(toXML({xml: "string"}, null, 2), "<xml>string</xml>\n");
    assert.equal(toXML({a: {b: "B"}}, null, 2), "<a>\n  <b>B</b>\n</a>\n");
    assert.equal(toXML({a: {b: {c: "C"}}}, null, 2), "<a>\n  <b>\n    <c>C</c>\n  </b>\n</a>\n");
    assert.equal(toXML({xml: "string"}, null, "  "), "<xml>string</xml>\n");
    assert.equal(toXML({a: {b: "B"}}, null, "  "), "<a>\n  <b>B</b>\n</a>\n");
    assert.equal(toXML({a: {b: {c: "C"}}}, null, "  "), "<a>\n  <b>\n    <c>C</c>\n  </b>\n</a>\n");
  });

  it("escape", function() {
    assert.equal(toXML({xml: 'L<G>A&Q"'}), '<xml>L&lt;G&gt;A&amp;Q&quot;</xml>');
    assert.equal(toXML({xml: {"@attr": 'L<G>A&Q"'}}), '<xml attr="L&lt;G&gt;A&amp;Q&quot;"/>');
  });
});
