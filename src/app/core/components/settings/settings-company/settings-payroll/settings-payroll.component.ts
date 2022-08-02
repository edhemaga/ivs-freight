import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';

@Component({
  selector: 'app-settings-payroll',
  templateUrl: './settings-payroll.component.html',
  styleUrls: ['./settings-payroll.component.scss'],
})
export class SettingsPayrollComponent implements OnChanges {
  @Input() public payrollData: any;

  constructor(private settingsStoreService: SettingsStoreService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.payrollData?.currentValue !== changes?.payrollData?.previousValue
    ) {
      this.payrollData = changes?.payrollData?.currentValue;
    }
  }

  public identity(index: number, item: any): number {
    return item.id;
  }
  public onAction(modal: { modalName: string; type: string; company?: any }) {
    this.settingsStoreService.onModalAction(modal);
  }
}
