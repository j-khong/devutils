export class DevUtils {
   public static isSet<T = any>(obj: T | null | undefined): obj is T {
      const res: boolean = undefined !== obj && null !== obj;
      if (typeof obj === 'string') {
         return res && 'undefined' !== obj;
      }
      return res;
   }
   public static isNotSet<T = any>(obj: T | null | undefined): obj is null | undefined {
      return !this.isSet<T>(obj);
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
   public static getFieldValue<T>(struct: Record<string, any>, fieldname: string, defval: T): T {
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
   public static getChildFieldValue<T>(struct: Record<string, any>, fieldnames: string[], defval: T): T {
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

   public static makeSingleton<T>(callback: () => Promise<T>) {
      let singleton: T | undefined;
      return (): Promise<T> => {
         return new Promise((resolve, reject) => {
            if (singleton !== undefined) {
               resolve(singleton);
               return;
            }
            callback()
               .then((sglton) => {
                  singleton = sglton;
                  resolve(singleton);
               })
               .catch((err) => {
                  reject(err);
               });
         });
      };
   }

   /**
    *
    * @param func the function to execute
    * @param waitForInMs the debounce time in milliseconds
    * @returns
    */
   public static debounce<F extends (...args: any[]) => void>(
      func: F,
      waitForInMs: number,
   ): (...args: Parameters<F>) => void {
      let timeout: ReturnType<typeof setTimeout>;

      return (...args: Parameters<F>): void => {
         clearTimeout(timeout);
         timeout = setTimeout(() => {
            func(...args);
         }, waitForInMs);
      };
   }
}
