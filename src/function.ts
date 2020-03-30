import { DevUtils } from './index';

export class FunctionUtils {
   public static isAsync(fn: any): boolean {
      if (DevUtils.isNotSet(fn)) {
         return false;
      }
      return fn.constructor.name === 'AsyncFunction';
   }
}
