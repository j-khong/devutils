import { DevUtils } from './index';

export class ArrayUtils {
   public static isEmpty(array: any[]): boolean {
      return DevUtils.isEmpty(array);
   }

   public static getField(array: any[], indexValue: any, fieldname: string, defval: any): any {
      if (!Array.isArray(array)) {
         return defval;
      }

      if (DevUtils.isSet(array) && DevUtils.isSet(array[indexValue]) && DevUtils.isSet(array[indexValue][fieldname])) {
         return array[indexValue][fieldname];
      }
      return defval;
   }
}
