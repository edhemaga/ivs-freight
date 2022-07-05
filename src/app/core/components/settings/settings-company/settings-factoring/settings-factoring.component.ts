import { ActivatedRoute } from '@angular/router';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { CompanyResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-settings-factoring',
  templateUrl: './settings-factoring.component.html',
  styleUrls: ['./settings-factoring.component.scss'],
  providers: [DetailsPageService],
})
export class SettingsFactoringComponent implements OnInit {
  @Input() public factoringData: any;
  public changeDefaultNotice: boolean;
  constructor(private settingsStoreService: SettingsStoreService) {}

  ngOnInit(): void {
    console.log(this.factoringData);
    this.getFactoringData(this.factoringData)
  }
  public getFactoringData(data: CompanyResponse) {
    // this.factoringData = data;
    if (this.factoringData.customNoticeOfAssigment != null) {
      this.changeDefaultNotice = true;
    } else {
      this.changeDefaultNotice = false;
    }
    console.log(this.changeDefaultNotice);
    
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
