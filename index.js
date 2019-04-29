"use strict";

function isSet(obj) { return ((undefined !== obj) && (null !== obj)); }
function isNotSet(obj) { return !isSet(obj); }
function getFieldValue(struct, fieldname, defval) {
    if (isSet(struct) && isSet(struct[fieldname])) {
        return struct[fieldname];
    }
    return defval;
}
function isEmptyArray(array) {
    if (!Array.isArray(array)) { return true; }
    return (isNotSet(array) || array.length === 0);
}
function isEmptyString(string) {
    if ('string' !== typeof string) { return true; }
    return (isNotSet(string) || string.trim().length === 0);
}

module.exports = {
    isSet: isSet,
    isNotSet: isNotSet,
    isOneNotSet: function (memberNames, data) {
        let ret = false;
        for (const member of memberNames) {
            if (isNotSet(data[member])) { ret = true; return; }
        }
        return ret;
    },
    isAllSet: function (memberNames, data) { return !isOneNotSet(memberNames, data); },
    getFieldValue: getFieldValue,
    getChildFieldValue: function (struct, fieldnames, defval) {
        let val = defval;

        for (const fieldname of fieldnames) {
            val = getFieldValue(struct, fieldname, defval);
            if (val === defval) { return defval; }
            struct = struct[fieldname];
        }
        return val;
    },
    isEmpty: function (value) {
        if (isNotSet(value)) { return true; }
        if (Array.isArray(value)) { return isEmptyArray(value); }
        if ('string' === typeof value) { return isEmptyString(value); }
        if ('object' === typeof value) { return Object.keys(value).length === 0; }

        return false;
    },
    isBlank: function (string) {
        return isEmptyString(string);
    },
    Array: {
        isEmpty: function (array) {
            return isEmptyArray(array);
        },
        getField(array, indexValue, fieldname, defval) {
            if (!Array.isArray(array)) { return defval; }

            if (isSet(array)
                && isSet(array[indexValue])
                && isSet(array[indexValue][fieldname])) {
                return array[indexValue][fieldname];
            }
            return defval;
        }
    },
    Function: {
        isAsync: function (fn) {
            if (isNotSet(fn)) { return false; }
            return (fn.constructor.name === 'AsyncFunction');
        }
    }
};
