import { DevUtils } from './index';

export class FunctionUtils {
   public static isAsync(fn: any): boolean {
      if (DevUtils.isNotSet(fn)) {
         return false;
      }
      return fn.toString().includes('__awaiter') || fn.constructor.name === 'AsyncFunction';
   }
}
