let assert = require('assert');
let DevUtils = require('./index');

describe('Object utils', function () {
  describe('#isSet()', function () {
    it('should return false when the value is undefined or null', function () {
      assert.equal(DevUtils.isSet(undefined), false);
      assert.equal(DevUtils.isSet(null), false);
    });
    it('should return true when the value is a number', function () {
      assert.equal(DevUtils.isSet(0), true);
      assert.equal(DevUtils.isSet(10), true);
      assert.equal(DevUtils.isSet(-10), true);
    });
    it('should return true when the value is a string', function () {
      assert.equal(DevUtils.isSet("0"), true);
      assert.equal(DevUtils.isSet("10"), true);
      assert.equal(DevUtils.isSet("-10"), true);
    });
    it('should return true when the value is a boolean', function () {
      assert.equal(DevUtils.isSet(true), true);
      assert.equal(DevUtils.isSet(false), true);
    });
    it('should return true when the value is an empty string', function () {
      assert.equal(DevUtils.isSet(""), true);
    });
    it('should return true when the value is an empty struct', function () {
      assert.equal(DevUtils.isSet({}), true);
    });
  });

  describe('#getFieldValue()', function () {
    it('should return def value when the struct or field or field value is null or undefined', function () {
      let defVal = 'defaultV';
      assert.equal(DevUtils.getFieldValue(null, 'myFieldName', defVal), defVal);
      assert.equal(DevUtils.getFieldValue(undefined, 'myFieldName', defVal), defVal);
      assert.equal(DevUtils.getFieldValue({}, 'myFieldName', defVal), defVal);
      assert.equal(DevUtils.getFieldValue({ myOtherField: 'a' }, 'myFieldName', defVal), defVal);
      assert.equal(DevUtils.getFieldValue({ myOtherField: null }, 'myFieldName', defVal), defVal);
      assert.equal(DevUtils.getFieldValue({ myFieldName: null }, 'myFieldName', defVal), defVal);
      assert.equal(DevUtils.getFieldValue({ myFieldName: undefined }, 'myFieldName', defVal), defVal);
    });

    it('should return the value when it is defined', function () {
      let defVal = 'defaultV';
      let expected = 1;
      assert.equal(DevUtils.getFieldValue({ myFieldName: expected }, 'myFieldName', defVal), expected);
      expected = '1';
      assert.equal(DevUtils.getFieldValue({ myFieldName: expected }, 'myFieldName', defVal), expected);
      expected = true;
      assert.equal(DevUtils.getFieldValue({ myFieldName: expected }, 'myFieldName', defVal), expected);
      expected = ['1', '2'];
      assert.equal(DevUtils.getFieldValue({ myFieldName: expected, myFieldName2: '1' }, 'myFieldName', defVal), expected);
    });
  });
  describe('#getChildFieldValue()', function () {
    it('should return def value when the struct or field or field value is null or undefined', function () {
      let defVal = 'defaultV';
      assert.equal(DevUtils.getChildFieldValue(null, ['myFieldName'], defVal), defVal);
      assert.equal(DevUtils.getChildFieldValue(null, ['myFieldName', 'child1'], defVal), defVal);
      assert.equal(DevUtils.getChildFieldValue(undefined, ['myFieldName'], defVal), defVal);
      assert.equal(DevUtils.getChildFieldValue({}, ['myFieldName'], defVal), defVal);
    });
    it('should return the value when it is defined', function () {
      let defVal = 'defaultV';
      assert.equal(DevUtils.getChildFieldValue({ myFieldName: { child1: { child2: 'bobby' } } }, ['myFieldName', 'child1', 'child2'], defVal), 'bobby');
      assert.equal(DevUtils.getChildFieldValue({ myFieldName: { child1: { child2: 'bobby' } } }, ['myFieldName', 'child1'], defVal).child2, 'bobby');
    });
  });
});

describe('String utils', function () {
  describe('#isBlank()', function () {
    it('should return true when the string is null, undefined, has no char or only blanks', function () {
      assert.equal(DevUtils.isBlank(null), true);
      assert.equal(DevUtils.isBlank(undefined), true);
      assert.equal(DevUtils.isBlank(""), true);
      assert.equal(DevUtils.isBlank(" "), true);
      assert.equal(DevUtils.isBlank("                  "), true);
    });
    it('should return true when the parameter is not a string', function () {
      assert.equal(DevUtils.isBlank(1), true);
      assert.equal(DevUtils.isBlank(true), true);
      assert.equal(DevUtils.isBlank({}), true);
    }),
      it('should return false when the string has at least 1 char other than blank', function () {
        assert.equal(DevUtils.isBlank("1"), false);
        assert.equal(DevUtils.isBlank(" &&&fsgsg"), false);
        assert.equal(DevUtils.isBlank(" &&&fsgsg. "), false);
        assert.equal(DevUtils.isBlank(" &&&.  fsgsg "), false);
        assert.equal(DevUtils.isBlank(" &&&.  fsgsg"), false);
        assert.equal(DevUtils.isBlank("&&&.  fsgsg"), false);
      });
  });
});