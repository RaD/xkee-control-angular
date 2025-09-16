import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from '../../services/storage';
import { SmartButtonComponent } from '../../components/smart-button/component';

@Component({
  selector: 'app-importer',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule, SmartButtonComponent],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class ImporterComponent {
  faArrowLeft = faArrowLeft;

  constructor(
    private localStore: StorageService,
    public router: Router,
    private route: ActivatedRoute,
  ) {}

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
}
