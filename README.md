# @jkhong/devutils

Provides syntactic sugar and shortcuts to bullet-proof your TypeScript/JavaScript code.

## Contents

- [Install](#install)
- [DevUtils](#devutils) — `isSet` · `isNotSet` · `isAllSet` · `isOneNotSet` · `isEmpty` · `getFieldValue` · `getChildFieldValue` · `makeSingleton` · `debounce` · `getError`
- [StringUtils](#stringutils) — `isBlank` · `capitalize` · `uncapitalize` · `replaceTrailing` · `replaceLeading`
- [ArrayUtils](#arrayutils) — `isEmpty` · `getField`
- [DateUtils](#dateutils) — `addDays` · `addMinutes` · `addSeconds`
- [FunctionUtils](#functionutils) — `isAsync`
- [InMemory](#inmemory-cache) — TTL-based in-memory cache
- [TestUtils](#testutils) — async test helpers

---

## Install

```sh
npm install @jkhong/devutils
```

---

## DevUtils

### `isSet(value)`
Returns `true` if the value is not `null`, not `undefined`, and not the string `'undefined'`.

```ts
import { DevUtils } from '@jkhong/devutils';

DevUtils.isSet(null);        // false
DevUtils.isSet(undefined);   // false
DevUtils.isSet('undefined'); // false
DevUtils.isSet(0);           // true
DevUtils.isSet('');          // true
DevUtils.isSet(false);       // true
```

### `isNotSet(value)`
Inverse of `isSet`.

### `isAllSet(memberNames, data)` / `isOneNotSet(memberNames, data)`
Check if all (or at least one) named fields of an object are set.

```ts
DevUtils.isAllSet(['id', 'name'], { id: 1, name: 'foo' }); // true
DevUtils.isOneNotSet(['id', 'name'], { id: 1 });            // true
```

### `isEmpty(value)`
Returns `true` for `null`, `undefined`, empty/blank strings, empty arrays, and empty objects.

```ts
DevUtils.isEmpty(null);      // true
DevUtils.isEmpty('   ');     // true
DevUtils.isEmpty([]);        // true
DevUtils.isEmpty({});        // true
DevUtils.isEmpty([1]);       // false
DevUtils.isEmpty({ a: 1 }); // false
```

### `getFieldValue(struct, fieldname, default)`
Returns the field value if set, otherwise the default.

```ts
DevUtils.getFieldValue({ age: 30 }, 'age', 0);  // 30
DevUtils.getFieldValue({}, 'age', 0);            // 0
DevUtils.getFieldValue(null, 'age', 0);          // 0
```

### `getChildFieldValue(struct, fieldnames, default)`
Traverses nested objects safely, returning the default if any level is missing.

```ts
const obj = { a: { b: { c: 'deep' } } };
DevUtils.getChildFieldValue(obj, ['a', 'b', 'c'], 'default'); // 'deep'
DevUtils.getChildFieldValue(obj, ['a', 'x', 'c'], 'default'); // 'default'
```

### `makeSingleton(asyncFactory)`
Wraps an async factory so it is called only once. Subsequent calls return the cached instance.

```ts
const getDb = DevUtils.makeSingleton(() => connectToDatabase());
await getDb(); // connects
await getDb(); // returns cached connection
```

### `debounce(fn, waitMs)`
Returns a debounced version of `fn` that fires only after `waitMs` ms of inactivity.

```ts
const save = DevUtils.debounce(() => api.save(), 300);
save(); save(); save(); // only the last call fires after 300ms
```

### `getError(e)`
Normalizes any thrown value to an `Error` instance. Useful in `catch (e: unknown)` blocks.

```ts
try { ... } catch (e: unknown) {
   const err = DevUtils.getError(e); // always an Error
}
```

---

## StringUtils

```ts
import { StringUtils } from '@jkhong/devutils';
```

| Method | Description |
|---|---|
| `isBlank(str)` | `true` if string is null, undefined, or contains only whitespace |
| `capitalize(word)` | Uppercases the first character |
| `uncapitalize(word)` | Lowercases the first character |
| `replaceTrailing(value, char, replacement)` | Replaces trailing occurrences of `char` |
| `replaceLeading(value, char, replacement)` | Replaces leading occurrences of `char` |

```ts
StringUtils.capitalize('hello');                   // 'Hello'
StringUtils.uncapitalize('World');                 // 'world'
StringUtils.replaceTrailing('foo///', '/', '');    // 'foo'
StringUtils.replaceLeading('///foo', '/', '');     // 'foo'
```

---

## ArrayUtils

```ts
import { ArrayUtils } from '@jkhong/devutils';
```

| Method | Description |
|---|---|
| `isEmpty(array)` | `true` if array is null, undefined, or has no elements |
| `getField(array, index, fieldname, default)` | Safely reads a field from an element at a given index |

```ts
ArrayUtils.isEmpty([]);                              // true
ArrayUtils.getField([{ id: 1 }], 0, 'id', null);   // 1
ArrayUtils.getField([], 0, 'id', null);             // null
```

---

## DateUtils

```ts
import { DateUtils } from '@jkhong/devutils';
```

| Method | Description |
|---|---|
| `addDays(date, n)` | Returns a new Date with `n` days added |
| `addMinutes(date, n)` | Returns a new Date with `n` minutes added |
| `addSeconds(date, n)` | Returns a new Date with `n` seconds added |

Accepts negative values to subtract. The original date is never mutated.

```ts
DateUtils.addDays(new Date(), 7);     // one week from now
DateUtils.addSeconds(new Date(), -30); // 30 seconds ago
```

---

## FunctionUtils

```ts
import { FunctionUtils } from '@jkhong/devutils';
```

| Method | Description |
|---|---|
| `isAsync(fn)` | `true` if the function is async |

```ts
FunctionUtils.isAsync(async () => {}); // true
FunctionUtils.isAsync(() => {});       // false
```

---

## InMemory (cache)

A TTL-based in-memory cache with per-entry TTL support and automatic background cleanup.

```ts
import { InMemory } from '@jkhong/devutils';
```

### Constructor options

| Option | Default | Description |
|---|---|---|
| `ttlInSec` | 3600 (1h) | Default TTL for entries |
| `autoTtlCleanIntervalInSec` | 3600 (1h) | How often expired entries are swept |
| `autoWipeAllIntervalInSec` | disabled | How often the entire cache is cleared (opt-in) |

### Methods

#### `add({ id, d, ttlInSec? })`
Adds or overwrites an entry. `ttlInSec` overrides the global default for this entry.

```ts
const cache = new InMemory<User>({ ttlInSec: 300 });
await cache.add({ id: 'u1', d: user });
await cache.add({ id: 'u2', d: user, ttlInSec: 60 }); // custom TTL
```

#### `fetch(id)`
Returns the cached value or `undefined` if missing or expired.

```ts
const user = await cache.fetch('u1'); // User | undefined
```

#### `fetchMultiple(ids)`
Splits a list of ids into cached hits and ids that still need to be fetched from the source.

```ts
const { cachedData, idsToRequest } = await cache.fetchMultiple(['u1', 'u2', 'u3']);
// cachedData    → [{ id: 'u1', data: User }, ...]
// idsToRequest  → ['u3']

const fresh = await api.getUsers(idsToRequest);
```

#### `remove(id)`
Removes a single entry immediately.

```ts
await cache.remove('u1');
```

#### `forceTtlClean()`
Triggers an immediate sweep to remove all expired entries.

#### `forceWipeAll()`
Clears all entries regardless of TTL.

#### `destroy()`
Stops background intervals and clears the cache. Call this when the cache instance is no longer needed to prevent timer leaks.

```ts
await cache.destroy();
```

---

## TestUtils

Helpers for structuring async tests with setup / run / assert phases.

```ts
import { TestUtils } from '@jkhong/devutils';
```

### `testExpectedSuccess({ setPreconditions, run, checkPostconditions })`
For testing a happy path. Returns `{ success: true }` or `{ success: false, error }`.

```ts
const result = await TestUtils.testExpectedSuccess({
   setPreconditions: async () => buildInput(),
   run: async (input) => myService.process(input),
   checkPostconditions: async (output) => {
      expect(output.status).toBe('ok');
   },
});
expect(result.success).toBe(true);
```

### `testExpectedError({ setPreconditions, run, checkError, checkPostconditions })`
For testing flows that return an error value (no exception thrown).

### `testExpectedException({ setPreconditions, run, checkError, checkPostconditions })`
For testing flows that are expected to throw.
