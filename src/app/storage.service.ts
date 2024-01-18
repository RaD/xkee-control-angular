import { Injectable } from '@angular/core';
import { Area } from './interfaces';
// import * as CryptoJS from 'crypto-js';

const key_areas = 'AREAS';
const key_area = 'AREA';

/**
 * Структура хранилища:
 * {
 *   'AREAS': ['UUID1', 'UUID2', ...],
 *   'AREA_UUID1': {
 *     'DEVICES': ['UUID10', 'UUID11', ...].
 *     'USERS': ['UUID20', 'UUID21', ...]
 *   },
 *   'DEVICE_UUID10': {...},
 *   'DEVICE_UUID11': {...},
 *   'USER_UUID20': {...},
 *   'USER_UUID21': {...}
 * }
 */

@Injectable({
  providedIn: 'root'
})
export class StorageService {
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

  public setData(key: string, value: string | any, stringify: boolean): void {
    if (stringify) {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }

  // public saveDataSecure(key: string, value: string): void {
  //   localStorage.setItem(key, this.encrypt(value));
  // }

  public getData(key: string, parse: boolean): any | null {
    let payload: string | null = localStorage.getItem(key)
    if (payload != null && parse) {
      payload = JSON.parse(payload);
    }
    return payload;
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

  /**
   * getAreas
   * Получает список идентификаторов территорий
   */
  public getAreaPkList(): string[] {
    let pks = this.getData(key_areas, true);
    if (pks == null) {
      pks = [];
    }
    return pks;
  }

  /**
   * setAreaPkList
   */
  public setAreaPkList(pks: string[]): void {
    this.setData(key_areas, pks, true);
  }

  /**
   * noAreas
   * Свойство, показывает наличие территорий
   */
  public noAreas(): boolean {
    let pks: string[] = this.getAreaPkList();
    return pks.length == 0;
  }

  /**
   * getArea
   * Получает территорию по её идентификатору
   */
  public getArea(pk: string): Area | null {
    let key: string = key_area + '_' + pk;
    let payload: any | null = this.getData(key, true);
    if (payload != null) {
      payload['pk'] = pk;
    }
    return payload
  }

  /**
   * getAreaList
   * Получает список доступных территорий
   */
  public getAreaList(): Area[] {
    let result: any[] = [];
    let pklist: string[]= this.getAreaPkList();
    pklist?.forEach(key => result.push(this.getArea(key)))
    return result;
  }

  /**
   * setArea
   */
  public setArea(pk: string, area: Area): void {
    let key: string = key_area + '_' + pk;
    this.setData(key, area, true);
  }
}
