# Purpose

Provides some syntactic sugar and shortcuts to bullet proof your devs

# Use

## check variable is set or empty

```js
import { DevUtils } from '@jkhong/devutils';

const emptyArray = [];
const emptyObject = {};
const emptyString = '';
const values = [null, undefined, 'undefined', 'not empty', emptyString, emptyArray, emptyObject];
for (const val of values) {
   if (DevUtils.isSet(val)) {
      console.log(`value [${val}] is set`);
   } else {
      console.log(`value [${val}] is not set`);
   }

   // uses isSet + check string/array/object emptyness
   if (DevUtils.isEmpty(val)) {
      console.log(`value [${val}] is empty`);
   } else {
      console.log(`value [${val}] is not empty`);
   }
}
```

## returns an object field value or the default value

```js
import { DevUtils } from '@jkhong/devutils';

const emptyObject = {};
const defaultValue = 'myValue';
let objectFieldValue = DevUtils.getFieldValue(emptyObject, 'aField', defaultValue);
console.log(objectFieldValue); // prints myValue

const object = { aField: 'objectValue' };
objectFieldValue = DevUtils.getFieldValue(object, 'aField', defaultValue);
console.log(objectFieldValue); // prints objectValue
```

## returns an sub object field value or the default value

```js
import { DevUtils } from '@jkhong/devutils';

const object = {
   aSubObject: {
      anotherSubObject: {
         aField: 'objectValue',
      },
   },
};
const defaultValue = 'myValue';
const objectFieldValue = DevUtils.getChildFieldValue(
   object,
   ['aSubObject', 'anotherSubObject', 'aField'],
   defaultValue,
);
console.log(objectFieldValue); // prints objectValue
```
