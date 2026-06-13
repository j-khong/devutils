export class DateUtils {
   public static addDays(d: Readonly<Date>, quantity: number): Date {
      const newDate = new Date(d);
      newDate.setDate(newDate.getDate() + quantity);
      return newDate;
   }

   public static addMinutes(d: Readonly<Date>, quantity: number): Date {
      const newDate = new Date(d);
      newDate.setMinutes(newDate.getMinutes() + quantity);
      return newDate;
   }

   public static addSeconds(d: Readonly<Date>, quantity: number): Date {
      const newDate = new Date(d);
      newDate.setSeconds(newDate.getSeconds() + quantity);
      return newDate;
   }
}
