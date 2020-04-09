let assert = require('assert');
const { DevUtils, StringUtils, FunctionUtils } = require('../dist/index');

describe('Object utils', function () {
   describe('#isSet()', function () {
      it('should return false when the value is undefined or null or "undefined"', function () {
         assert.equal(DevUtils.isSet(undefined), false);
         assert.equal(DevUtils.isSet('undefined'), false);
         assert.equal(DevUtils.isSet(null), false);
      });
      it('should return true when the value is a number', function () {
         assert.equal(DevUtils.isSet(0), true);
         assert.equal(DevUtils.isSet(10), true);
         assert.equal(DevUtils.isSet(-10), true);
      });
      it('should return true when the value is a string', function () {
         assert.equal(DevUtils.isSet('0'), true);
         assert.equal(DevUtils.isSet('10'), true);
         assert.equal(DevUtils.isSet('-10'), true);
      });
      it('should return true when the value is a boolean', function () {
         assert.equal(DevUtils.isSet(true), true);
         assert.equal(DevUtils.isSet(false), true);
      });
      it('should return true when the value is an empty string', function () {
         assert.equal(DevUtils.isSet(''), true);
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
         assert.equal(
            DevUtils.getFieldValue({ myFieldName: expected, myFieldName2: '1' }, 'myFieldName', defVal),
            expected,
         );
      });
   });
   describe('#getChildFieldValue()', function () {
      it('should return def value when the struct or field or field value is null or undefined', function () {
         let defVal = 'defaultV';
         assert.equal(DevUtils.getChildFieldValue(null, ['myFieldName'], defVal), defVal);
         assert.equal(DevUtils.getChildFieldValue(null, ['myFieldName', 'child1'], defVal), defVal);
         assert.equal(DevUtils.getChildFieldValue(undefined, ['myFieldName'], defVal), defVal);
         assert.equal(DevUtils.getChildFieldValue({}, ['myFieldName'], defVal), defVal);
         assert.equal(
            DevUtils.getChildFieldValue(
               { myFieldName: { child1: { child2: 'bobby' } } },
               ['myFieldName', 'child2'],
               defVal,
            ),
            defVal,
         );
      });
      it('should return the value when it is defined', function () {
         let defVal = 'defaultV';
         assert.equal(
            DevUtils.getChildFieldValue(
               { myFieldName: { child1: { child2: 'bobby' } } },
               ['myFieldName', 'child1', 'child2'],
               defVal,
            ),
            'bobby',
         );
         assert.equal(
            DevUtils.getChildFieldValue(
               { myFieldName: { child1: { child2: 'bobby' } } },
               ['myFieldName', 'child1'],
               defVal,
            ).child2,
            'bobby',
         );
      });
   });
   describe('#isEmpty()', function () {
      it('should return true if value is null or undefined', function () {
         assert.equal(DevUtils.isEmpty(null), true);
         assert.equal(DevUtils.isEmpty(undefined), true);
      });
      it('should return true if array is empty', function () {
         assert.equal(DevUtils.isEmpty([]), true);
      });
      it('should return false if array has one or multiple int', function () {
         assert.equal(DevUtils.isEmpty([1]), false);
         assert.equal(DevUtils.isEmpty([1, 8]), false);
         assert.equal(DevUtils.isEmpty([1, 129912, 8]), false);
      });
      it('should return false if array has one or multiple string', function () {
         assert.equal(DevUtils.isEmpty(['1']), false);
         assert.equal(DevUtils.isEmpty(['1', '8']), false);
         assert.equal(DevUtils.isEmpty(['1', '129912', '8']), false);
      });
      it('should return true if string has no char or only blanks', function () {
         const values = ['', ' ', '                  '];
         for (const value of values) {
            assert.equal(DevUtils.isEmpty(value), true);
         }
      });
      it('should return false when the string has at least 1 char other than blank', function () {
         const values = ['1', ' &&&fsgsg', ' &&&fsgsg. ', ' &&&.  fsgsg ', ' &&&.  fsgsg', '&&&.  fsgsg'];
         for (const value of values) {
            assert.equal(DevUtils.isEmpty(value), false);
         }
      });
      it('should return true if object has no keys', function () {
         assert.equal(DevUtils.isEmpty({}), true);
      });
      it('should return false if object has at least 1 key', function () {
         assert.equal(DevUtils.isEmpty({ name: '' }), false);
         assert.equal(DevUtils.isEmpty({ name: '', id: '' }), false);
      });
   });

   describe('String utils', function () {
      describe('#isBlank()', function () {
         it('should return true when the string is null, undefined, has no char or only blanks', function () {
            const values = [null, undefined, '', ' ', '                  '];
            for (const value of values) {
               assert.equal(StringUtils.isBlank(value), true);
            }
         });
         it('should return true when the parameter is not a string', function () {
            assert.equal(StringUtils.isBlank(1), true);
            assert.equal(StringUtils.isBlank(true), true);
            assert.equal(StringUtils.isBlank({}), true);
         });
         it('should return false when the string has at least 1 char other than blank', function () {
            const values = ['1', ' &&&fsgsg', ' &&&fsgsg. ', ' &&&.  fsgsg ', ' &&&.  fsgsg', '&&&.  fsgsg'];
            for (const value of values) {
               assert.equal(StringUtils.isBlank(value), false);
            }
         });
      });
   });

   describe('Function utils', function () {
      describe('#isAsync()', function () {
         it('should return true when the function is async', function () {
            const syncFunc = async () => {};
            assert.equal(FunctionUtils.isAsync(syncFunc), true);
         });
         it('should return false when the function is null', function () {
            const syncFunc = null;
            assert.equal(FunctionUtils.isAsync(syncFunc), false);
         });
         it('should return false when the function is undefined', function () {
            const syncFunc = undefined;
            assert.equal(FunctionUtils.isAsync(syncFunc), false);
         });
         it('should return false when the function is sync', function () {
            const syncFunc = () => {};
            assert.equal(FunctionUtils.isAsync(syncFunc), false);
         });
      });
   });
});
