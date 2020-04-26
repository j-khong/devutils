import { DevUtils } from './index';

export class StringUtils {
   public static isBlank(str: string): boolean {
      if ('string' !== typeof str) {
         return true;
      }
      return DevUtils.isEmpty(str);
   }

   public static replaceTrailing(value: string, charToTrim: string, replacement: string): string {
      if (DevUtils.isNotSet(value) || '' === value) {
         return '';
      }
      const regExp = new RegExp(charToTrim[0] + '+$');
      return value.replace(regExp, replacement);
   }

   public static replaceLeading(value: string, charToTrim: string, replacement: string): string {
      if (DevUtils.isNotSet(value) || '' === value) {
         return '';
      }
      const regExp = new RegExp('^' + charToTrim[0] + '+');
      return value.replace(regExp, replacement);
   }

   public static uncapitalize(word: string): string {
      if (DevUtils.isNotSet(word) || '' === word) {
         return '';
      }
      const lowercase = word[0].toLowerCase();
      if (word.length > 1) {
         return lowercase + word.substr(1);
      }
      return lowercase;
   }

   public static capitalize(word: string): string {
      if (DevUtils.isNotSet(word) || '' === word) {
         return '';
      }
      const uppercase = word[0].toUpperCase();
      if (word.length > 1) {
         return uppercase + word.substr(1);
      }
      return uppercase;
   }
}
