import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SettingsCompanyService } from '../../state/company-state/settings-company.service';

@Component({
  selector: 'app-settings-payroll',
  templateUrl: './settings-payroll.component.html',
  styleUrls: ['./settings-payroll.component.scss'],
})
export class SettingsPayrollComponent implements OnChanges {
  @Input() public payrollData: any;

  constructor(private settingsCompanyService: SettingsCompanyService) {}

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
    this.settingsCompanyService.onModalAction(modal);
  }
}
