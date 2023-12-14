import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalService } from '../local.service';
import { AreaFormComponent } from '../area-form/area-form.component';
import { Area } from '../area-form/area-form.interface';

type States = 'read' | 'create' | 'update';
const storage_key: string = 'database';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [
    CommonModule,
    AreaFormComponent,
  ],
  templateUrl: './area.component.html',
  styleUrl: './area.component.less'
})
export class AreaComponent {
  protected state: States = 'read';
  protected empty: boolean = true;
  protected areas: Area[] = [];
  protected selected_area?: Area;

  constructor(private localStore: LocalService) { }

  ngOnInit(): void {
    // проверка списка территорий
    this.load_storage();
    this.set_state('read');
  }

  private load_storage(): void {
    let payload: string | null = this.localStore.getData(storage_key)
    if (!payload) return;
    let data = JSON.parse(payload);
    this.areas = data.areas;
  }

  private save_storage(): void {
    let data = {
      'areas': this.areas
    }
    let payload = JSON.stringify(data);
    this.localStore.saveData(storage_key, payload);
  }

  public set_state(value: States): void {
    let last: States = this.state;
    switch(value) {
      case 'read':
        this.save_storage();
        this.empty = this.areas.length == 0;
        break;
    }
    this.state = value;
  }

  /**
   * on_change
   * Ловим событие и объект территории из дочернего компонента формы
   */
  public on_change(area: Area | undefined): void {
    if (area != undefined) {
      if (this.state == 'create') {
        this.areas.push(area);
      }
      if (area.delete) {
        this.areas = this.areas.filter(item => item != area);
      }
    }
    this.set_state('read');
  }

  /**
   * on_select
   * Обрабатываем выбор территории
   */

  public on_select(area: Area): void {
    this.selected_area = area;
    this.set_state('update');
  }
}
