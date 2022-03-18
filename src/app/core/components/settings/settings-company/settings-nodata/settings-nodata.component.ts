import { Component, OnInit } from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';

@Component({
  selector: 'app-settings-nodata',
  templateUrl: './settings-nodata.component.html',
  styleUrls: ['./settings-nodata.component.scss'],
})
export class SettingsNodataComponent implements OnInit {
  constructor(private settingsService: SettingsStoreService) {}

  ngOnInit(): void {
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
  }

  public goToSettings() {
    this.settingsService.modalSubject$.next({
      modalName: 'basic',
      type: true,
      action: 'new',
    });
    const body = document.querySelector('body');
    body.style.overflow = 'visible';
  }
}
