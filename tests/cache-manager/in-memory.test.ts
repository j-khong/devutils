import { describe, it, expect, vi, afterEach } from 'vitest';
import { InMemory } from '../../src/cache-manager/in-memory';
import { TestUtils } from '../../src/tests';

const instances: InMemory<unknown>[] = [];

function makeCache<T>(options?: ConstructorParameters<typeof InMemory>[0]): InMemory<T> {
   const cache = new InMemory<T>(options);
   instances.push(cache as InMemory<unknown>);
   return cache;
}

afterEach(async () => {
   vi.useRealTimers();
   await Promise.all(instances.map((c) => c.destroy()));
   instances.length = 0;
});

describe('Cache', () => {
   describe('#fetch()', () => {
      it('returns undefined when cache is empty', async () => {
         const result = await TestUtils.testExpectedSuccess({
            setPreconditions: async () => makeCache<string>(),
            run: async (cache) => cache.fetch('id1'),
            checkPostconditions: async (data) => {
               expect(data).toBeUndefined();
            },
         });
         expect(result.success).toBe(true);
      });

      it('returns undefined for unknown id', async () => {
         const result = await TestUtils.testExpectedSuccess({
            setPreconditions: async () => {
               const cache = makeCache<string>();
               await cache.add({ id: 'id1', d: 'value1' });
               return cache;
            },
            run: async (cache) => cache.fetch('id2'),
            checkPostconditions: async (data) => {
               expect(data).toBeUndefined();
            },
         });
         expect(result.success).toBe(true);
      });

      it('returns data after add', async () => {
         const result = await TestUtils.testExpectedSuccess({
            setPreconditions: async () => {
               const cache = makeCache<string>();
               await cache.add({ id: 'id1', d: 'value1' });
               return cache;
            },
            run: async (cache) => cache.fetch('id1'),
            checkPostconditions: async (data) => {
               expect(data).toBe('value1');
            },
         });
         expect(result.success).toBe(true);
      });

      it('returns data before TTL expires', async () => {
         vi.useFakeTimers();
         const result = await TestUtils.testExpectedSuccess({
            setPreconditions: async () => {
               const cache = makeCache<string>({ ttlInSec: 10 });
               await cache.add({ id: 'id1', d: 'value1' });
               vi.advanceTimersByTime(9_000);
               return cache;
            },
            run: async (cache) => cache.fetch('id1'),
            checkPostconditions: async (data) => {
               expect(data).toBe('value1');
            },
         });
         expect(result.success).toBe(true);
      });

      it('returns undefined after TTL expires', async () => {
         vi.useFakeTimers();
         const result = await TestUtils.testExpectedSuccess({
            setPreconditions: async () => {
               const cache = makeCache<string>({ ttlInSec: 10 });
               await cache.add({ id: 'id1', d: 'value1' });
               vi.advanceTimersByTime(11_000);
               return cache;
            },
            run: async (cache) => cache.fetch('id1'),
            checkPostconditions: async (data) => {
               expect(data).toBeUndefined();
            },
         });
         expect(result.success).toBe(true);
      });
   });

   describe('#fetchMultiple()', () => {
      it('returns all ids as idsToRequest when cache is empty', async () => {
         const result = await TestUtils.testExpectedSuccess({
            setPreconditions: async () => makeCache<string>(),
            run: async (cache) => cache.fetchMultiple(['id1', 'id2', 'id3']),
            checkPostconditions: async ({ idsToRequest, cachedData }) => {
               expect(idsToRequest).toEqual(['id1', 'id2', 'id3']);
               expect(cachedData).toEqual([]);
            },
         });
         expect(result.success).toBe(true);
      });

      it('returns all ids as cached when all are in cache', async () => {
         const result = await TestUtils.testExpectedSuccess({
            setPreconditions: async () => {
               const cache = makeCache<string>();
               await cache.add({ id: 'id1', d: 'value1' });
               await cache.add({ id: 'id2', d: 'value2' });
               return cache;
            },
            run: async (cache) => cache.fetchMultiple(['id1', 'id2']),
            checkPostconditions: async ({ idsToRequest, cachedData }) => {
               expect(idsToRequest).toEqual([]);
               expect(cachedData).toEqual([
                  { id: 'id1', data: 'value1' },
                  { id: 'id2', data: 'value2' },
               ]);
            },
         });
         expect(result.success).toBe(true);
      });

      it('returns a mix of cached and idsToRequest', async () => {
         const result = await TestUtils.testExpectedSuccess({
            setPreconditions: async () => {
               const cache = makeCache<string>();
               await cache.add({ id: 'id1', d: 'value1' });
               await cache.add({ id: 'id3', d: 'value3' });
               return cache;
            },
            run: async (cache) => cache.fetchMultiple(['id1', 'id2', 'id3']),
            checkPostconditions: async ({ idsToRequest, cachedData }) => {
               expect(idsToRequest).toEqual(['id2']);
               expect(cachedData).toEqual([
                  { id: 'id1', data: 'value1' },
                  { id: 'id3', data: 'value3' },
               ]);
            },
         });
         expect(result.success).toBe(true);
      });

      it('moves expired ids to idsToRequest, keeps fresh ones cached', async () => {
         vi.useFakeTimers();
         const result = await TestUtils.testExpectedSuccess({
            setPreconditions: async () => {
               const cache = makeCache<string>({ ttlInSec: 10 });
               await cache.add({ id: 'id1', d: 'value1' });
               await cache.add({ id: 'id2', d: 'value2' });
               vi.advanceTimersByTime(11_000);
               await cache.add({ id: 'id3', d: 'value3' });
               return cache;
            },
            run: async (cache) => cache.fetchMultiple(['id1', 'id2', 'id3']),
            checkPostconditions: async ({ idsToRequest, cachedData }) => {
               expect(idsToRequest).toEqual(['id1', 'id2']);
               expect(cachedData).toEqual([{ id: 'id3', data: 'value3' }]);
            },
         });
         expect(result.success).toBe(true);
      });
   });

   describe('#add()', () => {
      it('overwrites an existing cached value', async () => {
         const result = await TestUtils.testExpectedSuccess({
            setPreconditions: async () => {
               const cache = makeCache<string>();
               await cache.add({ id: 'id1', d: 'value1' });
               await cache.add({ id: 'id1', d: 'value2' });
               return cache;
            },
            run: async (cache) => cache.fetch('id1'),
            checkPostconditions: async (data) => {
               expect(data).toBe('value2');
            },
         });
         expect(result.success).toBe(true);
      });

      it('respects per-entry ttlInSec over the global default', async () => {
         vi.useFakeTimers();
         const result = await TestUtils.testExpectedSuccess({
            setPreconditions: async () => {
               const cache = makeCache<string>({ ttlInSec: 60 });
               await cache.add({ id: 'id1', d: 'value1', ttlInSec: 5 });
               await cache.add({ id: 'id2', d: 'value2' });
               vi.advanceTimersByTime(6_000);
               return cache;
            },
            run: async (cache) => cache.fetchMultiple(['id1', 'id2']),
            checkPostconditions: async ({ idsToRequest, cachedData }) => {
               expect(idsToRequest).toEqual(['id1']);
               expect(cachedData).toEqual([{ id: 'id2', data: 'value2' }]);
            },
         });
         expect(result.success).toBe(true);
      });
   });

   describe('#remove()', () => {
      it('removes a cached entry', async () => {
         const result = await TestUtils.testExpectedSuccess({
            setPreconditions: async () => {
               const cache = makeCache<string>();
               await cache.add({ id: 'id1', d: 'value1' });
               return cache;
            },
            run: async (cache) => {
               await cache.remove('id1');
               return cache.fetch('id1');
            },
            checkPostconditions: async (data) => {
               expect(data).toBeUndefined();
            },
         });
         expect(result.success).toBe(true);
      });

      it('does nothing for an unknown id', async () => {
         const result = await TestUtils.testExpectedSuccess({
            setPreconditions: async () => {
               const cache = makeCache<string>();
               await cache.add({ id: 'id1', d: 'value1' });
               return cache;
            },
            run: async (cache) => {
               await cache.remove('id2');
               return cache.fetch('id1');
            },
            checkPostconditions: async (data) => {
               expect(data).toBe('value1');
            },
         });
         expect(result.success).toBe(true);
      });
   });

   describe('#forceTtlClean()', () => {
      it('removes expired entries proactively', async () => {
         vi.useFakeTimers();
         const result = await TestUtils.testExpectedSuccess({
            setPreconditions: async () => {
               const cache = makeCache<string>({ ttlInSec: 10 });
               await cache.add({ id: 'id1', d: 'value1' });
               await cache.add({ id: 'id2', d: 'value2' });
               vi.advanceTimersByTime(11_000);
               await cache.add({ id: 'id3', d: 'value3' });
               return cache;
            },
            run: async (cache) => {
               await cache.forceTtlClean();
               return cache.fetchMultiple(['id1', 'id2', 'id3']);
            },
            checkPostconditions: async ({ idsToRequest, cachedData }) => {
               expect(idsToRequest).toEqual(['id1', 'id2']);
               expect(cachedData).toEqual([{ id: 'id3', data: 'value3' }]);
            },
         });
         expect(result.success).toBe(true);
      });
   });

   describe('#forceWipeAll()', () => {
      it('clears all entries regardless of TTL', async () => {
         const result = await TestUtils.testExpectedSuccess({
            setPreconditions: async () => {
               const cache = makeCache<string>();
               await cache.add({ id: 'id1', d: 'value1' });
               await cache.add({ id: 'id2', d: 'value2' });
               return cache;
            },
            run: async (cache) => {
               await cache.forceWipeAll();
               return cache.fetchMultiple(['id1', 'id2']);
            },
            checkPostconditions: async ({ idsToRequest, cachedData }) => {
               expect(idsToRequest).toEqual(['id1', 'id2']);
               expect(cachedData).toEqual([]);
            },
         });
         expect(result.success).toBe(true);
      });
   });
});
