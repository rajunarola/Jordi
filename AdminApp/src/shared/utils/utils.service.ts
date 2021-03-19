import * as CryptoJS from 'crypto-js';
export class Utils {
  static excludelist: any[] = [];

  // The set method is use for encrypt the value .
  public static enLocalStorageValue(value: any) {
    if (value == null) {
      return;
    }
    try {
      const constKey = '7061737323313233';
      const key = CryptoJS.enc.Utf8.parse(constKey);
      const iv = CryptoJS.enc.Utf8.parse(constKey);
      const encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(value.toString()),
        key,
        {
          keySize: 128 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      return encrypted.toString();
    }
    catch (e) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('companyQuestion');
      localStorage.removeItem('currentProject');
      window.location.reload();
    }

  }

  // The get method is use for decrypt the value  .
  public static crLocalStorageValue(value: any) {
    if (value == null) {
      return;
    }
    try {
      const constKey = '7061737323313233';
      const key = CryptoJS.enc.Utf8.parse(constKey);
      const iv = CryptoJS.enc.Utf8.parse(constKey);
      const decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    }
    catch (e) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('companyQuestion');
      localStorage.removeItem('currentProject');
      window.location.reload();
    }
  }

}
