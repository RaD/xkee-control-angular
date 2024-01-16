import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Area } from './interface';

@Component({
  selector: 'app-area-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class AreaFormComponent {
  @Input() state?: string;
  @Input() selected_area?: Area;
  @Output() event = new EventEmitter<Area>();
  public area: Area = {
    uuid: '',
    title: '',
    address: '',
    kind: '',
    delete: false,
    access: null,
    secret: null
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

  protected need_credentials(): boolean {
    return this.area.kind == 'xkee';
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
