import { Injectable } from '@angular/core';
import crypto from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class EncryptionDecryptionService {
  private securedKey: string =
    '__+_+_+#!.../>!$!$&*&!$CHICAGOTRUCKASSISTNIS$!&$&*)))__)!)#__+_+_+#!.../>';
  private IV: string = '*$!&&$!*#!#(*(())()(#!)(#';

  //The set method is use for encrypt the value.
  private set(value: any) {
    // return CryptoJS.AES.encrypt(value, this.securedKey).toString();
    let _key = crypto.enc.Utf8.parse(this.securedKey);
    let _iv = crypto.enc.Utf8.parse(this.IV);
    return crypto.AES.encrypt(JSON.stringify(value), _key, {
      iv: _iv,
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7,
    }).toString(crypto.format.Hex);
  }

  //The get method is use for decrypt the value.
  private get(encryptValue: any) {
    let _key = crypto.enc.Utf8.parse(this.securedKey);
    let _iv = crypto.enc.Utf8.parse(this.IV);

    return JSON.parse(
      crypto.AES.decrypt(encryptValue.toString(), _key, {
        keySize: 16,
        iv: _iv,
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7,
      }).toString(crypto.enc.Utf8)
    );
    // return CryptoJS.AES.decrypt(value, this.securedKey).toString(
    //   CryptoJS.enc.Utf8
    // );
  }

  public setLocalStorage(key: string, value: any) {
    localStorage.setItem(key, this.set(value));
  }

  public getLocalStorage(key: string): any {
    console.log(this.get(localStorage.getItem(key)));
    // return JSON.parse(this.get(localStorage.getItem(key)));
    this.removeItem(key);
  }

  private removeItem(key: string) {
    localStorage.removeItem(key);
  }
}
