import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-importer',
  standalone: true,
  imports: [],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class ImporterComponent {

  constructor(
    private localStore: StorageService,
    private router: Router,
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
