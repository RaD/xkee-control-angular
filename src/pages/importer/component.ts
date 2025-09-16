import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { StorageService } from '../../services/storage';
import { SmartButtonComponent } from '../../components/smart-button/component';
import { PageTransitionService } from '../../services/transitions';

@Component({
  selector: 'app-importer',
  standalone: true,
  imports: [
    FontAwesomeModule,
    SmartButtonComponent,
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class ImporterComponent {
  private pageTransition = inject(PageTransitionService);
  private location = inject(Location);
  private localStore = inject(StorageService);
  public router = inject(Router);

  faArrowLeft = faArrowLeft;

  protected onFileSelected(target: any): void {
    const file: File = target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = () => {
        let content = reader.result;
        this.localStore.import_area(`${reader.result}`);
        // возвращаемся на список
        this.router.navigate(['/areas']);
      }
      reader.readAsText(file);
    }
  }

  protected navigateBack(): void {
    this.pageTransition.navigateBack(() => {
      this.location.back();
    });
  }
}
