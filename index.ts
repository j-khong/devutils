"use strict";


class DevUtils {
    public static isSet(obj: any): boolean { return ((undefined !== obj) && (null !== obj) && ("undefined" !== obj)); }
    public static isNotSet(obj: any): boolean { return !this.isSet(obj); }
    public static isOneNotSet(memberNames: string[], data: any): boolean {
        let ret = false;
        for (const member of memberNames) {
            if (this.isNotSet(data[member])) { ret = true; break; }
        }
        return ret;
    }
    public static isAllSet(memberNames: string[], data: any): boolean { return !this.isOneNotSet(memberNames, data); }
    public static getFieldValue(struct: any, fieldname: string, defval: any): any {
        if (this.isSet(struct) && this.isSet(struct[fieldname])) {
            return struct[fieldname];
        }
        return defval;
    }
    private static isEmptyArray(array: any[]): boolean {
        if (!Array.isArray(array)) { return true; }
        return (this.isNotSet(array) || array.length === 0);
    }
    private static isEmptyString(str: String): boolean {
        if ('string' !== typeof str) { return true; }
        return (this.isNotSet(str) || str.trim().length === 0);
    }
    public static getChildFieldValue(struct: any, fieldnames: string[], defval: any): any {
        let val = defval;

        for (const fieldname of fieldnames) {
            val = this.getFieldValue(struct, fieldname, defval);
            if (val === defval) { return defval; }
            struct = struct[fieldname];
        }
        return val;
    }
    public static isEmpty(value: any): boolean {
        if (this.isNotSet(value)) { return true; }
        if (Array.isArray(value)) { return this.isEmptyArray(value); }
        if ('string' === typeof value) { return this.isEmptyString(value); }
        if ('object' === typeof value) { return Object.keys(value).length === 0; }

        return false;
    }

}
class ArrayUtils {
    public static isEmpty(array: any[]): boolean { return DevUtils.isEmpty(array); }

    public static getField(array: any[], indexValue: any, fieldname: string, defval: any): any {
        if (!Array.isArray(array)) { return defval; }

        if (DevUtils.isSet(array)
            && DevUtils.isSet(array[indexValue])
            && DevUtils.isSet(array[indexValue][fieldname])) {
            return array[indexValue][fieldname];
        }
        return defval;
    }
}
class StringUtils {
    public static isBlank(str: string): boolean {
        if ('string' !== typeof str) { return true; }
        return DevUtils.isEmpty(str);
    }
}
class FunctionUtils {
    public static isAsync(fn: any): boolean {
        if (DevUtils.isNotSet(fn)) { return false; }
        return (fn.constructor.name === 'AsyncFunction');
    }
}

export { DevUtils, StringUtils, FunctionUtils, ArrayUtils }
