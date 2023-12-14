import { Injectable } from '@angular/core';
// import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class LocalService {
  secret_key: string = '';

  constructor() { }

  // private encrypt(value: string): string {
  //   let data = CryptoJS.AES.encrypt(value, this.secret_key);
  //   return data.toString()
  // }

  // private decrypt(value: string): string {
  //   let data = CryptoJS.AES.decrypt(value, this.secret_key);
  //   return data.toString(CryptoJS.enc.Utf8);
  // }

  public saveData(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // public saveDataSecure(key: string, value: string): void {
  //   localStorage.setItem(key, this.encrypt(value));
  // }

  public getData(key: string): string | null {
    return localStorage.getItem(key)
  }

  // public getDataSecure(key: string): string | null {
  //   let data: string | null = localStorage.getItem(key);
  //   if (data == null) return null;
  //   return this.decrypt(data)
  // }

  public removeData(key: string): void {
    localStorage.removeItem(key);
  }

  public clearData(): void {
    localStorage.clear();
  }
}
