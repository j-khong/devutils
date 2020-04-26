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
   describe('#replaceTrailing()', function () {
      it('should return empty string when the string is null, undefined, has no char', function () {
         const values = [null, undefined, ''];
         for (const value of values) {
            assert.equal(StringUtils.replaceTrailing(value, '/', ''), '');
         }
      });
      it('should return the unmodified string if it does not contain the replacement character at the end', function () {
         const values = [' ', '     ', '', 'qsflqsf', 'jklkqsjf flskjf lqs lfqj lfqsj ', '#ù$^ù,;:,;;:\\'];
         for (const value of values) {
            assert.equal(StringUtils.replaceTrailing(value, '/', ''), value);
         }
      });

      it('should return the unmodified string if it does not contain the replacement character at the end but is elsewhere', function () {
         const values = ['/czfzfz ', 'zfzf//fzfzf', 'zfz/fzfz/fzfz', '/ffff//qsvqV/qvqvv', 'fqffq/ '];
         for (const value of values) {
            assert.equal(StringUtils.replaceTrailing(value, '/', ''), value);
         }
      });
      it('should return the modified string if it contains the replacement character at the end', function () {
         const values = [
            { input: '#ù$^ù,;:,;;:/', output: '#ù$^ù,;:,;;:' },
            { input: '/fksjfs/fslkfsf/', output: '/fksjfs/fslkfsf' },
         ];
         for (const value of values) {
            assert.equal(StringUtils.replaceTrailing(value.input, '/', ''), value.output);
         }
      });
   });
   describe('#replaceLeading()', function () {
      it('should return empty string when the string is null, undefined, has no char', function () {
         const values = [null, undefined, ''];
         for (const value of values) {
            assert.equal(StringUtils.replaceLeading(value, '/', ''), '');
         }
      });
      it('should return the unmodified string if it does not contain the replacement character at the beginning', function () {
         const values = [' ', '     ', '', 'qsflqsf', 'jklkqsjf flskjf lqs lfqj lfqsj ', '#ù$^ù,;:,;;:\\'];
         for (const value of values) {
            assert.equal(StringUtils.replaceLeading(value, '/', ''), value);
         }
      });

      it('should return the unmodified string if it does not contain the replacement character at the beginning but is elsewhere', function () {
         const values = [' / czfzfz ', 'zfzf//fzfzf/', 'zfz/fzfz/fzfz', 'ffff//qsvqV/qvqvv/'];
         for (const value of values) {
            assert.equal(StringUtils.replaceLeading(value, '/', ''), value);
         }
      });
      it('should return the modified string if it contains the replacement character at the beginning', function () {
         const values = [
            { input: '/#ù$^ù,;:,;;:', output: '#ù$^ù,;:,;;:' },
            { input: '/fksjfs/fslkfsf/', output: 'fksjfs/fslkfsf/' },
         ];
         for (const value of values) {
            assert.equal(StringUtils.replaceLeading(value.input, '/', ''), value.output);
         }
      });
   });
   describe('#capitalize()', function () {
      it('should return empty string when the string is null, undefined, has no char', function () {
         const values = [null, undefined, ''];
         for (const value of values) {
            assert.equal(StringUtils.capitalize(value), '');
         }
      });
      it('should not change the string', function () {
         const values = [
            { input: '#ù$^ù,;:,;;:/', output: '#ù$^ù,;:,;;:/' },
            { input: '   ', output: '   ' },
            { input: ' ', output: ' ' },
            { input: ' capitalize', output: ' capitalize' },
            { input: 'Aaaaaa', output: 'Aaaaaa' },
         ];
         for (const value of values) {
            assert.equal(StringUtils.capitalize(value.input), value.output);
         }
      });
      it('should capitalize the string', function () {
         const values = [
            { input: 'aAAAAaaa', output: 'AAAAAaaa' },
            { input: 'a', output: 'A' },
            { input: 'abcdeF', output: 'AbcdeF' },
         ];
         for (const value of values) {
            assert.equal(StringUtils.capitalize(value.input), value.output);
         }
      });
   });
   describe('#uncapitalize()', function () {
      it('should return empty string when the string is null, undefined, has no char', function () {
         const values = [null, undefined, ''];
         for (const value of values) {
            assert.equal(StringUtils.uncapitalize(value), '');
         }
      });
      it('should not change the string', function () {
         const values = [
            { input: '#ù$^ù,;:,;;:/', output: '#ù$^ù,;:,;;:/' },
            { input: '   ', output: '   ' },
            { input: ' ', output: ' ' },
            { input: ' Uncapitalize', output: ' Uncapitalize' },
            { input: 'aaaaaa', output: 'aaaaaa' },
         ];
         for (const value of values) {
            assert.equal(StringUtils.uncapitalize(value.input), value.output);
         }
      });
      it('should uncapitalize the string', function () {
         const values = [
            { input: 'AAAAAaaa', output: 'aAAAAaaa' },
            { input: 'A', output: 'a' },
            { input: 'AbcdeF', output: 'abcdeF' },
         ];
         for (const value of values) {
            assert.equal(StringUtils.uncapitalize(value.input), value.output);
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
