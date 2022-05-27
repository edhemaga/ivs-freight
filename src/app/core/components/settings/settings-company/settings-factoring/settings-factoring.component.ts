import { Component } from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';

@Component({
  selector: 'app-settings-factoring',
  templateUrl: './settings-factoring.component.html',
  styleUrls: ['./settings-factoring.component.scss'],
})
export class SettingsFactoringComponent {
  public factoringData = {
      phone:'(123) 456-7890',
      email:'peraperic@gmail.com',
      address:'5462 N East River Rd apt 611,Chicago, IL 60656, USA',
      noticeAssigment:{
        text:'This invoice has been assigned to,and must be paid directly to:',
        param1:'Advance Business Capital LLC DBA Triumph Business Capital P.O. Box 610028 Dallas TX 75261-0028',
        param2:'Claims or offsets should be directed to 866-414-9600'
      }
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
