import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-factoring',
  templateUrl: './settings-factoring.component.html',
  styleUrls: ['./settings-factoring.component.scss'],
})
export class SettingsFactoringComponent {
  public factoringData = {
    id: 1,
  };

  public onAction(modal: { modalName: string; type: boolean; action: string }) {
    switch(modal.action) {
      case 'edit': {

        break;
      }
      default: {
        break;
      }
    }
  }
}
