export class DevUtils {
   public static isSet(obj: any): boolean {
      return undefined !== obj && null !== obj && 'undefined' !== obj;
   }
   public static isNotSet(obj: any): boolean {
      return !this.isSet(obj);
   }
   public static isOneNotSet(memberNames: string[], data: any): boolean {
      let ret = false;
      for (const member of memberNames) {
         if (this.isNotSet(data[member])) {
            ret = true;
            break;
         }
      }
      return ret;
   }
   public static isAllSet(memberNames: string[], data: any): boolean {
      return !this.isOneNotSet(memberNames, data);
   }
   public static getFieldValue(struct: any, fieldname: string, defval: any): any {
      if (this.isSet(struct) && this.isSet(struct[fieldname])) {
         return struct[fieldname];
      }
      return defval;
   }
   private static isEmptyArray(array: any[]): boolean {
      if (!Array.isArray(array)) {
         return true;
      }
      return this.isNotSet(array) || array.length === 0;
   }
   private static isEmptyString(str: string): boolean {
      if ('string' !== typeof str) {
         return true;
      }
      return this.isNotSet(str) || str.trim().length === 0;
   }
   public static getChildFieldValue(struct: any, fieldnames: string[], defval: any): any {
      let val = defval;

      for (const fieldname of fieldnames) {
         val = this.getFieldValue(struct, fieldname, defval);
         if (val === defval) {
            return defval;
         }
         struct = struct[fieldname];
      }
      return val;
   }
   public static isEmpty(value: any): boolean {
      if (this.isNotSet(value)) {
         return true;
      }
      if (Array.isArray(value)) {
         return this.isEmptyArray(value);
      }
      if ('string' === typeof value) {
         return this.isEmptyString(value);
      }
      if ('object' === typeof value) {
         return Object.keys(value).length === 0;
      }

      return false;
   }
}

export { StringUtils } from './string';
export { ArrayUtils } from './array';
export { FunctionUtils } from './function';
