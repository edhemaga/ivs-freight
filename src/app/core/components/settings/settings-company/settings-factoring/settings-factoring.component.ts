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

  public onAction(modal: { modalName: string; type: boolean; action: string }) {
    switch(modal.action) {
      case 'edit': {
        this.settingsStoreService.onModalAction(modal.type, modal.modalName, modal.action);
        break;
      }
      default: {
        break;
      }
    }
  }
}
