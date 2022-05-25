import { Component } from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';

@Component({
  selector: 'app-settings-payroll',
  templateUrl: './settings-payroll.component.html',
  styleUrls: ['./settings-payroll.component.scss'],
})
export class SettingsPayrollComponent {
  public payrollData = {
    driverOwner: [
      {
        id: 1,
        name: 'Solo Empty Mile',
        value: '$0.70',
      },
      {
        id: 2,
        name: 'Solo Loaded Mile',
        value: '$0.80',
      },
      {
        id: 3,
        name: 'Solo Per Stop',
        value: '$50.00',
      },
      {
        id: 4,
        name: 'Team Empty Mile',
        value: '$1.00',
      },
      {
        id: 5,
        name: 'Team Loaded Mile',
        value: '$1.20',
      },
      {
        id: 6,
        name: 'Team Per Stop',
        value: '$80.00',
      },
      {
        id: 7,
        name: 'Solo Commission',
        value: '25.00%',
      },
      {
        id: 8,
        name: 'Team Commission',
        value: '32.00%',
      },
      {
        id: 9,
        name: 'Owner Commission',
        value: '15.00%',
      },
    ],
    accounting: [
      {
        id: 1,
        name: 'Salary',
        value: '$1,700.00',
      },
    ],
    companyOwner: [
      {
        id: 1,
        name: 'Salary',
        value: '$3,000.00',
      },
    ],
    dispatch: [
      {
        id: 1,
        name: 'Base',
        value: '$500.00',
      },
      {
        id: 2,
        name: 'Load Commission',
        value: '2.50%',
      },
    ],
    manager: [
      {
        id: 1,
        name: 'Base',
        value: '$500.00',
      },
      {
        id: 2,
        name: 'Revenue Commission',
        value: '0.75%',
      },
    ],
    recruiting: [
      {
        id: 1,
        name: 'Salary',
        value: '$1,500.00',
      },
    ],
    repair: [
      {
        id: 1,
        name: 'Salary',
        value: '$2,000.00',
      },
    ],
    safety: [
      {
        id: 1,
        name: 'Salary',
        value: '$1,000.00',
      },
    ],
    other: [
      {
        id: 1,
        name: 'Salary',
        value: '$1,500.00',
      },
    ],
  };

  constructor(private settingsStoreService: SettingsStoreService) {}

  public onAction(modal: { modalName: string; action: string }) {
    this.settingsStoreService.onModalAction(modal);
  }
}
