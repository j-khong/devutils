import { DevUtils } from './index';

export class StringUtils {
   public static isBlank(str: string): boolean {
      if ('string' !== typeof str) {
         return true;
      }
      return DevUtils.isEmpty(str);
   }
}
