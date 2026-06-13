import { DateUtils } from '../dates';
import { CacheManager } from './cache-manager';

const oneMinInSec = 60;
const _60minInSec = 60 * oneMinInSec;
const MAX_INTEGER_32 = 2 ** 31 - 1;

export class InMemory<Data> implements CacheManager<Data> {
   private readonly cache: Map<
      string,
      {
         timestamp: number;
         data: Data;
         ttlInSec: number;
      }
   > = new Map();

   private readonly ttlInSec = _60minInSec;
   private readonly autoTtlCleanIntervalInSec = _60minInSec;
   private autoTtlCleanIntervalHandle: number | undefined;
   private readonly autoWipeAllIntervalInSec: number | undefined;
   private autoWipeAllIntervalHandle: number | undefined;

   constructor(options?: { ttlInSec?: number; autoTtlCleanIntervalInSec?: number; autoWipeAllIntervalInSec?: number }) {
      if (options !== undefined) {
         this.ttlInSec = options.ttlInSec ?? this.ttlInSec;
         this.autoTtlCleanIntervalInSec = options.autoTtlCleanIntervalInSec ?? this.autoTtlCleanIntervalInSec;
         this.autoWipeAllIntervalInSec = options.autoWipeAllIntervalInSec;
      }
      this.setAutoTtlCleanIntervalHandle();
      this.setWipeAllIntervalHandle();
   }

   async fetchMultiple(
      ids: string[],
   ): Promise<{
      idsToRequest: string[];
      cachedData: Array<{ id: string; data: Data }>;
   }> {
      const idsToRequest: string[] = [];
      const cachedData: Array<{ id: string; data: Data }> = [];
      await Promise.all(
         ids.map(async (id) => {
            const data = await this.fetch(id);
            if (data !== undefined) {
               cachedData.push({ id, data });
            } else {
               idsToRequest.push(id);
            }
         }),
      );

      return {
         idsToRequest,
         cachedData,
      };
   }

   async fetch(id: string): Promise<Data | undefined> {
      const data = this.cache.get(id);
      if (data === undefined) {
         return undefined;
      }
      const timeLimit = DateUtils.addSeconds(new Date(), -data.ttlInSec);
      const isValidData = data.timestamp > timeLimit.getTime();
      if (isValidData) {
         return data.data;
      }

      this.remove(id);
      return undefined;
   }

   async add(o: { id: string; d: Data; ttlInSec?: number }): Promise<void> {
      const ttlInSec = o.ttlInSec ?? this.ttlInSec;
      this.cache.set(o.id, { data: o.d, timestamp: new Date().getTime(), ttlInSec });
   }

   async remove(id: string): Promise<void> {
      this.cache.delete(id);
   }

   async forceTtlClean(): Promise<void> {
      this.ttlClean();
      this.setAutoTtlCleanIntervalHandle();
   }

   private setAutoTtlCleanIntervalHandle(): void {
      clearInterval(this.autoTtlCleanIntervalHandle);
      this.autoTtlCleanIntervalHandle = setInterval(
         () => this.ttlClean(),
         toSafeIntervalMs(this.autoTtlCleanIntervalInSec),
      );
   }

   private ttlClean(): void {
      this.cache.forEach((data, id) => {
         const timeLimit = DateUtils.addSeconds(new Date(), -data.ttlInSec);
         if (data.timestamp <= timeLimit.getTime()) {
            this.cache.delete(id);
         }
      });
   }

   async forceWipeAll(): Promise<void> {
      this.wipeAll();
      this.setWipeAllIntervalHandle();
   }

   private setWipeAllIntervalHandle(): void {
      clearInterval(this.autoWipeAllIntervalHandle);
      if (this.autoWipeAllIntervalInSec !== undefined) {
         this.autoWipeAllIntervalHandle = setInterval(
            () => this.wipeAll(),
            toSafeIntervalMs(this.autoWipeAllIntervalInSec),
         );
      }
   }

   private wipeAll(): void {
      this.cache.clear();
   }

   async destroy(): Promise<void> {
      clearInterval(this.autoTtlCleanIntervalHandle);
      clearInterval(this.autoWipeAllIntervalHandle);
      this.cache.clear();
   }
}

function toSafeIntervalMs(sec: number): number {
   return Math.min(sec * 1_000, MAX_INTEGER_32);
}
