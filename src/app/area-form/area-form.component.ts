import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Area } from './area-form.interface';

@Component({
  selector: 'app-area-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './area-form.component.html',
  styleUrl: './area-form.component.less'
})
export class AreaFormComponent {
  @Input() state?: string;
  @Input() selected_area?: Area;
  @Output() event = new EventEmitter<Area>();
  public area: Area = {
    uuid: '',
    title: '',
    address: '',
    delete: false
  };

  ngOnInit(): void {
    // заполняем форму, если передана модель территории
    if (this.selected_area) {
      this.area = this.selected_area;
    }
  }

  protected random_uuid(): string {
    return crypto.randomUUID();
  }

  /**
   * apply
   * Отправляем модель территории родительскому компоненту
   */
  public apply(): void {
    if (this.state == 'create') {
      this.area.uuid = this.random_uuid();
    }
    this.event.emit(this.area);
  }

  /**
   * cancel
   * Отменяем действие
   */
  public cancel(): void {
    this.event.emit();
  }

  /**
   * delete
   * Удаляем модель
   */
  public delete(): void {
    this.area.delete = true;
    this.event.emit(this.area);

  }
}
