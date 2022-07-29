import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
@Component({
  selector: 'app-settings-insurancepolicy',
  templateUrl: './settings-insurancepolicy.component.html',
  styleUrls: ['./settings-insurancepolicy.component.scss'],
})
export class SettingsInsurancepolicyComponent implements OnChanges {
  @Input() public insurancePolicyData: any;
  public copyPolicyName: boolean[] = [];

  constructor(
    private settingsStoreService: SettingsStoreService,
    private notificationService: NotificationService,
    private clipboar: Clipboard
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.insurancePolicyData?.currentValue !==
      changes?.insurancePolicyData?.previousValue
    ) {
      this.insurancePolicyData = changes?.insurancePolicyData?.currentValue;
    }
  }

  public onAction(modal: { modalName: string; type: string; company?: any }) {
    this.settingsStoreService.onModalAction(modal);
  }

  public deleteInsurancePolicy(insurance: any) {
    this.settingsStoreService
      .deleteInsurancePolicyById(insurance.id)
      .subscribe({
        next: () => {
          this.notificationService.success('SUCCESS DELETE', 'Success');
        },
        error: () => {
          this.notificationService.error('Error  DELETE', 'Error');
        },
      });
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  /* To copy any Text */
  public copyText(val: any, index: number) {
    this.copyPolicyName[index] = true;
    this.clipboar.copy(val);
  }
}
