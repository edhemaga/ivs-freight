import { Component, Input, OnInit } from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';

@Component({
  selector: 'app-settings-payroll',
  templateUrl: './settings-payroll.component.html',
  styleUrls: ['./settings-payroll.component.scss'],
})
export class SettingsPayrollComponent implements OnInit {
  @Input() public payrollData: any;

  constructor(private settingsStoreService: SettingsStoreService) {}
  ngOnInit(): void {}
  public identity(index: number, item: any): number {
    return item.id;
  }
  public onAction(modal: { modalName: string; type: string; company?: any }) {
    this.settingsStoreService.onModalAction(modal);
  }
}
