import { Component, OnInit, Input } from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';
import { CompanyResponse } from 'appcoretruckassist';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-settings-factoring',
  templateUrl: './settings-factoring.component.html',
  styleUrls: ['./settings-factoring.component.scss'],
})
export class SettingsFactoringComponent implements OnInit {
  @Input() public factoringData: any;
  public changeDefaultNotice: boolean;
  public factoringPhone: boolean;
  public factoringEmail: boolean;
  constructor(
    private settingsStoreService: SettingsStoreService,
    private clipboar: Clipboard
  ) {}

  ngOnInit(): void {
    this.getFactoringData(this.factoringData);
  }
  public getFactoringData(data: CompanyResponse) {
    if (this.factoringData.customNoticeOfAssigment) {
      this.changeDefaultNotice = true;
    } else {
      this.changeDefaultNotice = false;
    }
  }
  public onAction(modal: { modalName: string; type: string; company?: any }) {
    switch (modal.type) {
      case 'edit': {
        this.settingsStoreService.onModalAction(modal);
        break;
      }
      default: {
        break;
      }
    }
  }

  /* To copy any Text */
  public copyText(val: any, name: string) {
    switch (name) {
      case 'phone':
        this.factoringPhone = true;
        break;
      case 'email':
        this.factoringEmail = true;
        break;
    }

    this.clipboar.copy(val);
  }
}
