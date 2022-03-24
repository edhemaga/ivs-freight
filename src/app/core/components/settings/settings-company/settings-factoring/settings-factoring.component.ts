import { Component } from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';

@Component({
  selector: 'app-settings-factoring',
  templateUrl: './settings-factoring.component.html',
  styleUrls: ['./settings-factoring.component.scss'],
})
export class SettingsFactoringComponent {
  public factoringData = {
    id: 1,
  };

  constructor(private settingsStoreService: SettingsStoreService) {}

  public onAction(modal: { type: boolean; modalName: string; action: string }) {
    switch (modal.action) {
      case 'edit': {
        this.settingsStoreService.onModalAction(modal);
        break;
      }
      default: {
        break;
      }
    }
  }
}
