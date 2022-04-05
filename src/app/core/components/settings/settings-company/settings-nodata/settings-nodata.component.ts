import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';

@Component({
  selector: 'app-settings-nodata',
  templateUrl: './settings-nodata.component.html',
  styleUrls: ['./settings-nodata.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsNodataComponent implements OnInit {
  constructor(private settingsService: SettingsStoreService) {}

  ngOnInit(): void {
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
  }

  public openModal() {
    this.settingsService.onModalAction({
      type: true,
      modalName: 'basic',
      action: 'new',
    });
    const body = document.querySelector('body');
    body.style.overflow = 'visible';
  }
}
