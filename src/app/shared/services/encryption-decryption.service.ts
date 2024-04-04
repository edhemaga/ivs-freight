import { Injectable } from '@angular/core';
import crypto from 'crypto-js';

@Injectable({
    providedIn: 'root',
})
export class EncryptionDecryptionService {
    private securedKey: string =
        '__+_+_+#!.../>!$!$&*&!$CHICAGOTRUCKASSISTNIS$!&$&*)))__)!)#__+_+_+#!.../>';
    private salt = crypto.lib.WordArray.random(128 / 8);
    private key256Bits = crypto.PBKDF2(this.securedKey, this.salt, {
        keySize: 128 / 32,
    });

    //The set method is use for encrypt the value.
    private set(message: any): string {
        return crypto.AES.encrypt(message, this.key256Bits, {
            iv: this.salt,
            padding: crypto.pad.Pkcs7,
            mode: crypto.mode.CBC,
        }).toString();
    }

    //The get method is use for decrypt the value.
    private get(encrypt_value: any) {
        return crypto.AES.decrypt(encrypt_value, this.key256Bits, {
            iv: this.salt,
            padding: crypto.pad.Pkcs7,
            mode: crypto.mode.CBC,
        }).toString(crypto.enc.Utf8);
    }

    public setLocalStorage(key: string, value: any) {
        localStorage.setItem(key, this.set(JSON.stringify(value)));
    }

    public getLocalStorage(key: string): any {
        return JSON.parse(this.get(localStorage.getItem(key)));
    }

    public removeItem(key: string) {
        localStorage.removeItem(key);
    }
}
