export interface CacheManager<Data> {
   fetch: (id: string) => Promise<Data | undefined>;

   add: (o: { id: string; d: Data; ttlInSec?: number }) => Promise<void>;
   remove: (id: string) => Promise<void>;

   fetchMultiple: (
      ids: string[],
   ) => Promise<{
      idsToRequest: string[];
      cachedData: Array<{ id: string; data: Data }>;
   }>;

   forceTtlClean: () => Promise<void>;
   forceWipeAll: () => Promise<void>;

   destroy: () => Promise<void>;
}
