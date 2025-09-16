import { Component, OnInit } from '@angular/core';

import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Area } from './interface';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-area-form',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class AreaComponent implements OnInit {
  protected fields: Area;
  protected pk: string | null;
  protected action: string | null;

  constructor(
    private localStore: StorageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.fields = new Area(crypto.randomUUID(), '', '', '', [], [], {});
    this.pk = this.route.snapshot.paramMap.get('pk');
    this.action = this.route.snapshot.paramMap.get('action');
  }

  ngOnInit(): void {
    if (this.pk != null && this.action != null) {
      let area = this.localStore.getArea(this.pk);
      if (area != null) {
        if (this.action === 'delete') {
          this.localStore.removeArea(this.pk);
          // возвращаемся на список
          this.router.navigate(['/areas']);
        } else {
          this.fields = new Area(
            area.pk, area.title, area.address, area.kind,
            area.devices, area.customers, area.linked, area.access, area.secret);
        }
      }
    }
  }

  protected need_credentials(): boolean {
    return this.fields.kind == 'xkee';
  }

  protected is_creation(): boolean {
    return this.pk == null;
  }

  /**
   * onSubmit
   * Обработка отправки формы
   */
  public onSubmit(): void {
    // создаём ключ для территории
    let pk: string = this.fields.pk;
    let area: Area = new Area(
      this.fields.pk,
      this.fields.title,
      this.fields.address,
      this.fields.kind,
      this.fields.devices,
      this.fields.customers,
      this.fields.linked,
      this.fields.access,
      this.fields.secret
    );
    this.localStore.setArea(pk, area);
    // возвращаемся на список
    this.router.navigate(['/areas']);
  }

  protected export(): void {
    const pk = this.route.snapshot.paramMap.get('pk');
    if (pk) {
      let ts: string = new Date().toJSON();
      let content: any = this.localStore.export_area(pk);
      let a = document.createElement('a');
      let file = new Blob([content], {type: 'application/json'});
      a.href = URL.createObjectURL(file);
      a.download = `xkee-area-${pk}-${ts}.json`;
      a.click();
    }
  }
}
