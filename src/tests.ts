import { DevUtils } from './dev';

type Result = { success: true } | { success: false; error: Error };

export class TestUtils {
   static async testExpectedSuccess<Input, Output>(o: {
      setPreconditions: () => Promise<Input>;
      run: (i: Input) => Promise<Output>;
      checkPostconditions: (o: Output) => Promise<void>;
   }): Promise<Result> {
      try {
         const input = await o.setPreconditions();
         const output = await o.run(input);
         await o.checkPostconditions(output);
         return { success: true };
      } catch (e) {
         return { success: false, error: DevUtils.getError(e) };
      }
   }

   static async testExpectedError<Input, Output>(o: {
      setPreconditions: () => Promise<Input>;
      run: (i: Input) => Promise<Output>;
      checkError: (o: Output) => Promise<void>;
      checkPostconditions: (o: Output) => Promise<void>;
   }): Promise<Result> {
      try {
         const input = await o.setPreconditions();
         const output = await o.run(input);
         await o.checkError(output);
         await o.checkPostconditions(output);
         return { success: true };
      } catch (e) {
         return { success: false, error: DevUtils.getError(e) };
      }
   }

   static async testExpectedException<Input, Output>(o: {
      setPreconditions: () => Promise<Input>;
      run: (i: Input) => Promise<Output>;
      checkError: (e: unknown) => Promise<void>;
      checkPostconditions: () => Promise<void>;
   }): Promise<Result> {
      try {
         const input = await o.setPreconditions();
         await o.run(input);
         return { success: false, error: new Error('No exception thrown') };
      } catch (e) {
         await o.checkError(e);
         await o.checkPostconditions();
         return { success: true };
      }
   }
}
