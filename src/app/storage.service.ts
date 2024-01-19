import { Injectable } from '@angular/core';
import { Area } from './area-form/interface';
import { Device } from './device/interface';
import { Customer } from './customer/interface';
// import * as CryptoJS from 'crypto-js';

const key_areas = 'AREAS';
const key_area = 'AREA';
const key_devices = 'DEVICES';
const key_device = 'DEVICE';
const key_customers = 'CUSTOMERS';
const key_customer = 'CUSTOMER';

/**
 * Структура хранилища:
 * {
 *   'AREAS': ['UUID1', 'UUID2', ...],
 *   'AREA_UUID1': {
 *     ...
 *     'DEVICES': ['UUID10', 'UUID11', ...].
 *     'CUSTOMERS': ['UUID20', 'UUID21', ...]
 *   },
 *   'DEVICE_UUID10': {...},
 *   'DEVICE_UUID11': {...},
 *   'CUSTOMER_UUID20': {...},
 *   'CUSTOMER_UUID21': {...}
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
    } else {
      console.log('getArea: Not found: ' + pk);
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
   * Записывает информацию о территории
   */
  public setArea(pk: string, area: Area): void {
    let key: string = key_area + '_' + pk;
    this.setData(key, area, true);
    // добавляем идентификатор территории в список
    let pks: string[] = this.getAreaPkList();
    if (pks.indexOf(pk) == -1) {
      pks.push(pk);
    }
    this.setAreaPkList(pks);
  }

  /**
   * removeArea
   * Удаляет информацию о территории
   */
  public removeArea(pk: string): void {
    // очищаем сначала зависимости
    let area: Area | null= this.getArea(pk);
    if (!area) {
      console.log(`Unable to find area(${pk})`);
      return;
    }
    area.devices.forEach(key => this.removeDevice(key, pk));
    area.customers.forEach(key => this.removeCustomer(key, pk));
    // удаляем саму территорию
    let key: string = key_area + '_' + pk;
    this.removeData(key)
    // удаляем идентификатор территории из списка
    let pks: string[] = this.getAreaPkList();
    const index = pks.indexOf(pk);
    if (index > -1) {
      pks.splice(index, 1);
    }
    this.setAreaPkList(pks);
  }

  /**
   * getDevicePkList
   * Получает список идентификаторов устройств территории
   */
  public getDevicePkList(area_pk: string): string[] {
    let area = this.getArea(area_pk);
    return area ? area.devices : [];
  }

  /**
   * setDevicePkList
   * Устанавливает список идентификаторов устройств территории
   */
  public setDevicePkList(area_pk: string, pks: string[]): void {
    let area = this.getArea(area_pk);
    if (area != null) {
      area.devices = pks;
      this.setArea(area_pk, area);
    }
  }

  /**
   * noDevicesInArea
   * Свойство, показывает наличие устройств на территории
   */
  public noDevicesInArea(area_pk: string): boolean {
    let area = this.getArea(area_pk);
    return area ? area.devices.length == 0 : true;
  }

  /**
   * getDevice
   * Получает устройство по его идентификатору
   */
  public getDevice(pk: string): Device | null {
    let key: string = key_device + '_' + pk;
    let payload: any | null = this.getData(key, true);
    if (payload != null) {
      payload['pk'] = pk;
    }
    return payload
  }

  /**
   * getDeviceList
   * Получает список доступных устройств на территории
   */
  public getDeviceList(area_pk: string): Device[] {
    let result: any[] = [];
    let pklist: string[]= this.getDevicePkList(area_pk);
    pklist.forEach(key => result.push(this.getDevice(key)))
    return result;
  }

  /**
   * setDevice
   * Записывает информацию об устройстве территории
   */
  public setDevice(pk: string, area_pk: string, device: Device): void {
    let key: string = key_device + '_' + pk;
    this.setData(key, device, true);
    // получаем территорию
    let area = this.getArea(area_pk);
    if (area != null) {
      // добавляем идентификатор устройства в список территории
      let pks: string[] = area.devices;
      if (pks.indexOf(pk) == -1) {
        pks.push(pk);
      }
      area.devices = pks;
      this.setDevicePkList(area_pk, pks);
    }
  }

  /**
   * removeDevice
   * Удаляет информацию об устройстве на территории
   */
  public removeDevice(pk: string, area_pk: string): void {
    let key: string = key_device + '_' + pk;
    this.removeData(key)
    // получаем территорию
    let area = this.getArea(area_pk);
    if (area != null) {
      // удаляем идентификатор устройства из списка территории
      let pks: string[] = area.devices;
      const index = pks.indexOf(pk);
      if (index > -1) {
        pks.splice(index, 1);
      }
      area.devices = pks;
      this.setDevicePkList(area_pk, pks);
    }
  }

  /**
   * getCustomerPkList
   * Получает список идентификаторов клиентов территории
   */
  public getCustomerPkList(area_pk: string): string[] {
    let area = this.getArea(area_pk);
    return area ? area.customers : [];
  }

  /**
   * setCustomerPkList
   * Устанавливает список идентификаторов клиентов территории
   */
  public setCustomerPkList(area_pk: string, pks: string[]): void {
    let area = this.getArea(area_pk);
    if (area != null) {
      area.customers = pks;
      this.setArea(area_pk, area);
    }
  }

  /**
   * noCustomersInArea
   * Свойство, показывает наличие клиентов на территории
   */
  public noCustomersInArea(area_pk: string): boolean {
    let area = this.getArea(area_pk);
    return area ? area.customers.length == 0 : true;
  }

  /**
   * getCustomer
   * Получает клиента по его идентификатору
   */
  public getCustomer(pk: string): Customer | null {
    let key: string = key_customer + '_' + pk;
    let payload: any | null = this.getData(key, true);
    if (payload != null) {
      payload['pk'] = pk;
    }
    return payload
  }

  /**
   * getCustomerList
   * Получает список доступных клиентов на территории
   */
  public getCustomerList(area_pk: string): Customer[] {
    let result: any[] = [];
    let pklist: string[]= this.getCustomerPkList(area_pk);
    pklist.forEach(key => result.push(this.getCustomer(key)))
    return result;
  }

  /**
   * setCustomer
   * Записывает информацию о клиенте территории
   */
  public setCustomer(pk: string, area_pk: string, customer: Customer): void {
    let key: string = key_customer + '_' + pk;
    this.setData(key, customer, true);
    // получаем территорию
    let area = this.getArea(area_pk);
    if (area != null) {
      // добавляем идентификатор устройства в список территории
      let pks: string[] = area.customers;
      if (pks.indexOf(pk) == -1) {
        pks.push(pk);
      }
      area.customers = pks;
      this.setCustomerPkList(area_pk, pks);
    }
  }

  /**
   * removeCustomers
   * Удаляет информацию о клиенте на территории
   */
  public removeCustomer(pk: string, area_pk: string): void {
    let key: string = key_customer + '_' + pk;
    this.removeData(key)
    // получаем территорию
    let area = this.getArea(area_pk);
    if (area != null) {
      // удаляем идентификатор устройства из списка территории
      let pks: string[] = area.customers;
      const index = pks.indexOf(pk);
      if (index > -1) {
        pks.splice(index, 1);
      }
      area.customers = pks;
      this.setCustomerPkList(area_pk, pks);
    }
  }

  /**
   * export
   * Экспорт базы данных
   */
  public export_area(pk: string): any {
    let area: Area | null = this.getArea(pk);
    if (area) {
      // устройства
      let devices: Device[] = [];
      area.devices.forEach(dpk => {
        let device: Device | null = this.getDevice(dpk);
        if (device) {
          devices.push(device);
        }
      });
      area.export_devices = devices;
      // клиенты
      let customers: Customer[] = [];
      area.customers.forEach(cpk => {
        let customer: Customer | null = this.getCustomer(cpk);
        if (customer) {
          customers.push(customer);
        }
      });
      area.export_customers = customers;
    }
    return JSON.stringify(area);
  }

  /**
   * import_area
   * Импорт базы данных
   */
  public import_area(content: string): void {
    let data: any = JSON.parse(content);
    let area: Area = new Area(
      data.pk, data.title, data.address, data.kind,
      data.devices, data.customers, data.access, data.secret
    );
    this.setArea(area.pk, area);
    data.export_devices.forEach((item: Device) => {
      this.setDevice(item.pk, area.pk, item);
    });
    data.export_customers.forEach((item: Customer) => {
      this.setCustomer(item.pk, area.pk, item);
    });
  }
}
