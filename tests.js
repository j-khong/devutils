let assert = require('assert');
let DevUtils = require('./index');

describe('Object utils', function() {
  describe('#isSet()', function() {
    it('should return false when the value is undefined or null', function() {
      assert.equal(DevUtils.isSet(undefined), false);
      assert.equal(DevUtils.isSet(null), false);
    });
    it('should return true when the value is a number', function() {
      assert.equal(DevUtils.isSet(0), true);
      assert.equal(DevUtils.isSet(10), true);
      assert.equal(DevUtils.isSet(-10), true);
    });
    it('should return true when the value is a string', function() {
      assert.equal(DevUtils.isSet("0"), true);
      assert.equal(DevUtils.isSet("10"), true);
      assert.equal(DevUtils.isSet("-10"), true);
    });
    it('should return true when the value is a boolean', function() {
      assert.equal(DevUtils.isSet(true), true);
      assert.equal(DevUtils.isSet(false), true);
    });
    it('should return true when the value is an empty string', function() {
      assert.equal(DevUtils.isSet(""), true);
    });
    it('should return true when the value is an empty struct', function() {
      assert.equal(DevUtils.isSet({}), true);
    });
  });
});

describe('Stringr utils', function() {
  describe('#isBlank()', function() {
    it('should return true when the string is null, underfined, has no char or only blanks', function() {
      assert.equal(DevUtils.isBlank(null), true);
      assert.equal(DevUtils.isBlank(undefined), true);
      assert.equal(DevUtils.isBlank(""), true);
      assert.equal(DevUtils.isBlank(" "), true);
      assert.equal(DevUtils.isBlank("                  "), true);
    });
    it('should return true when the parameter is not a string', function() {
      assert.equal(DevUtils.isBlank(1), true);
      assert.equal(DevUtils.isBlank(true), true);
      assert.equal(DevUtils.isBlank({}), true);
    }),
    it('should return false when the string has at least 1 char other than blank', function() {
      assert.equal(DevUtils.isBlank("1"), false);
      assert.equal(DevUtils.isBlank(" &&&fsgsg"), false);
      assert.equal(DevUtils.isBlank(" &&&fsgsg. "), false);
      assert.equal(DevUtils.isBlank(" &&&.  fsgsg "), false);
      assert.equal(DevUtils.isBlank(" &&&.  fsgsg"), false);
      assert.equal(DevUtils.isBlank("&&&.  fsgsg"), false);
    });
  });
});