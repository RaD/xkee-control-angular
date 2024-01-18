/**
 * Модуль обеспечивает явное подтверждение операции удаления.
 */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ConfirmationEntity } from './interface';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class ConfirmationComponent implements OnInit {
  protected entity: ConfirmationEntity;

  constructor(
    private localStore: StorageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.entity = new ConfirmationEntity('', '', '', '');
  }

  ngOnInit(): void {
    const entity = this.route.snapshot.paramMap.get('entity');
    const pk = this.route.snapshot.paramMap.get('pk');
    if (entity == null || pk == null) {
      return;
    }
    switch(entity) {
      case 'areas':
        let area = this.localStore.getArea(pk);
        if (area != null) {
          this.entity = new ConfirmationEntity(
            area.pk,
            'территорию',
            area.title,
            'Адрес: ' + area.address);
        }
        break;
    }
  }
}
