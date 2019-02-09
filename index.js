"use strict";

function isSet(obj) { return ((undefined !== obj) && (null !== obj)); }
function isNotSet(obj) { return !isSet(obj); }
function getFieldValue(struct, fieldname, defval) {
  if (isSet(struct) && isSet(struct[fieldname])) {
    return struct[fieldname];
  }
  return defval;
}
module.exports = {
  isSet: isSet,
  isNotSet: isNotSet,
  isOneNotSet: function (memberNames, data) {
    var ret = false;
    memberNames.forEach(function (member) {
      if (isNotSet(data[member])) { ret = true; return; }
    });
    return ret;
  },
  isAllSet: function (memberNames, data) { return !isOneNotSet(memberNames, data); },
  getFieldValue: getFieldValue,
  getChildFieldValue: function (struct, fieldnames, defval) {
    let val = defval;

    fieldnames.forEach(fieldname => {
      val = getFieldValue(struct, fieldname, defval);
      if (val == defval) { return defval; }
      struct = struct[fieldname];
    });
    return val;
  },
  isBlank: function (string) {
    if ('string' !== typeof string) { return true; }
    return (!isSet(string) || string.trim().length === 0);
  },
  Array: {
    isEmpty: function (array) {
      if (!Array.isArray(array)) { return true; }
      return (!isSet(array) || array.length === 0);
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
  }
};
