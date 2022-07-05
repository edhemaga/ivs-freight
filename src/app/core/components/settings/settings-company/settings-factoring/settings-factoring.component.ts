import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';
import { CompanyResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-settings-factoring',
  templateUrl: './settings-factoring.component.html',
  styleUrls: ['./settings-factoring.component.scss'],
})
export class SettingsFactoringComponent implements OnInit {
  @Input() public factoringData: any;
  public changeDefaultNotice: boolean;
  constructor(private settingsStoreService: SettingsStoreService) {}

  ngOnInit(): void {
    this.getFactoringData(this.factoringData)
  }
  public getFactoringData(data: CompanyResponse) {
    if (this.factoringData.customNoticeOfAssigment) {
      this.changeDefaultNotice = true;
    } else {
      this.changeDefaultNotice = false;
    }
    
  }
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
