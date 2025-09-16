/**
 * Модуль обеспечивает явное подтверждение операции удаления.
 */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationEntity } from './interface';
import { StorageService } from '../../services/storage';
import { Device } from '../device/interface';
import { SmartButtonComponent } from '../../components/smart-button/component';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    RouterLink,
    FontAwesomeModule,
    SmartButtonComponent
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class ConfirmationPage implements OnInit {
  faTimes = faTimes;
  faCheck = faCheck;

  protected entity: ConfirmationEntity;
  protected message: string;

  constructor(
    private localStore: StorageService,
    public router: Router,
    private route: ActivatedRoute,
  ) {
    this.entity = new ConfirmationEntity('', '', '', '', '', '');
    this.message = '';
  }

  ngOnInit(): void {
    const area_pk = this.route.snapshot.paramMap.get('area_pk');
    const entity = this.route.snapshot.paramMap.get('entity');
    const entity_pk = this.route.snapshot.paramMap.get('entity_pk');
    if (area_pk == null) {
      return;
    }
    let area = this.localStore.getArea(area_pk);
    if (!area) {
      console.log(`Unable to find area($pk)`);
      return
    }
    if (entity == null) {
      this.entity = new ConfirmationEntity(
        'территории',
        'Вы уверены, что желаете удалить территорию?',
        area.title,
        'Адрес: ' + area.address,
        `/areas/${area.pk}/delete`,
        `/areas/${area.pk}/edit`,
        );
    } else {
      if (entity_pk == null) {
        console.log('Unable to find entity_pk');
        return;
      }
      switch(entity) {
        case 'device':
          let device: Device | null = this.localStore.getDevice(entity_pk);
          if (device == null) {
            console.log(`Unable to find device($pk)`);
            return;
          }
          this.entity = new ConfirmationEntity(
            'устройства',
            'Вы уверены, что желаете удалить устройство?',
            `${area.title}: ${device.title}`,
            'Описание: ' + device.description,
            `/areas/${area.pk}/device/${device.pk}/delete`,
            `/areas/${area.pk}/device/${device.pk}/edit`,
            );
          break;
      }
    }
  }
}
