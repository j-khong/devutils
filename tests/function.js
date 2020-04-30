let assert = require('assert');
const { FunctionUtils } = require('../dist/index');

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
