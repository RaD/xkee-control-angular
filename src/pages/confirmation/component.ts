/**
 * Модуль обеспечивает явное подтверждение операции удаления.
 */
import { Component, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

import { ConfirmationEntity } from './interface';
import { StorageService } from '../../services/storage';
import { Device } from '../device/interface';
import { SmartButtonComponent } from '../../components/smart-button/component';
import { PageTransitionService } from '../../services/transitions';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    FontAwesomeModule,
    SmartButtonComponent
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class ConfirmationPage implements OnInit {
  private pageTransition = inject(PageTransitionService);
  private location = inject(Location);
  private localStore = inject(StorageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  faTimes = faTimes;
  faCheck = faCheck;

  protected entity: ConfirmationEntity = new ConfirmationEntity('', '', '', '', '');
  protected message: string = '';

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
            );
          break;
      }
    }
  }

  protected navigateBack(): void {
    this.pageTransition.navigateBack(() => {
      this.location.back();
    });
  }

  protected navigateConfirmed(): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigateByUrl(this.entity.url_confirmed);
    });
  }
}
