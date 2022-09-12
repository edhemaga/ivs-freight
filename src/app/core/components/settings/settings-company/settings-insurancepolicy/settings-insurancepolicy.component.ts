import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { SettingsCompanyService } from '../../state/company-state/settings-company.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { NotificationService } from '../../../../services/notification/notification.service';
@Component({
  selector: 'app-settings-insurancepolicy',
  templateUrl: './settings-insurancepolicy.component.html',
  styleUrls: ['./settings-insurancepolicy.component.scss'],
})
export class SettingsInsurancepolicyComponent implements OnChanges {
  @Input() public insurancePolicyData: any;
  public copyPolicyName: boolean[] = [];
  public dropOptions: any;

  constructor(
    private settingsCompanyService: SettingsCompanyService,
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

  ngOnInit(): void {
    this.initDropOptions();
  }

  public onAction(modal: { modalName: string; type: string; company?: any }) {
    this.settingsCompanyService.onModalAction(modal);
  }

  public deleteInsurancePolicy(insurance: any) {
    this.settingsCompanyService
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
  /**Function for dots in cards */
  public initDropOptions(): void {
    this.dropOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideViewMode: false,
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
      },
      actions: [
        {
          title: 'Edit',
          name: 'edit',
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
          show: true,
        },

        {
          title: 'Delete',
          name: 'delete-item',
          type: 'driver',
          text: 'Are you sure you want to delete driver(s)?',
          svg: 'assets/svg/common/ic_trash.svg',
          danger: true,
          show: true,
        },
      ],
      export: true,
    };
  }

  //Function for drop-down
  public optionsEvent(action: any, insurance: any) {
    switch (action.type) {
      case 'edit': {
        this.onAction({
          modalName: 'insurance-policy',
          type: 'edit',
          company: insurance,
        });
        break;
      }
      case 'delete-item': {
        this.deleteInsurancePolicy(insurance);
        break;
      }
      default: {
        break;
      }
    }
  }
}
