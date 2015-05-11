
var assert = require('assert');

function foo() {
    assert(false, 'shit happens in util file');
}

exports.foo = foo;