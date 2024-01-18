import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Area } from './interface';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-area-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class AreaFormComponent implements OnInit {
  protected fields: Area;

  constructor(
    private localStore: StorageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.fields = new Area(crypto.randomUUID(), '', '', '', [], []);
  }

  ngOnInit(): void {
    const pk = this.route.snapshot.paramMap.get('pk');
    const action = this.route.snapshot.paramMap.get('action');
    if (pk != null && action != null) {
      let area = this.localStore.getArea(pk);
      if (area != null) {
        if (action === 'delete') {
          this.localStore.removeArea(pk);
          // возвращаемся на список
          this.router.navigate(['/areas']);
        } else {
          this.fields = new Area(
            area.pk, area.title, area.address, area.kind,
            area.devices, area.users, area.access, area.secret);
        }
      }
    }
  }

  protected need_credentials(): boolean {
    return this.fields.kind == 'xkee';
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
      this.fields.users,
      this.fields.access,
      this.fields.secret
    );
    this.localStore.setArea(pk, area);
    // возвращаемся на список
    this.router.navigate(['/areas']);
  }
}
