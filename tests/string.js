let assert = require('assert');
const { StringUtils } = require('../dist/index');

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
