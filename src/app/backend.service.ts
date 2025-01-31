import { Injectable } from '@angular/core';
import { Http } from '@angular/http'

const URL: string = (window as any)?.env?.BASE_URL || process.env['BASE_URL'];

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: Http) { }
}
