import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private titleSignal = signal<string>('Управление');

  get title() {
    return this.titleSignal();
  }

  setTitle(title: string): void {
    this.titleSignal.set(title);
  }
}
