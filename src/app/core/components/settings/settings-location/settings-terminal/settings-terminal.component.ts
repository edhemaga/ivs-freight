import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-settings-terminal',
  templateUrl: './settings-terminal.component.html',
  styleUrls: ['./settings-terminal.component.scss'],
})
export class SettingsTerminalComponent implements OnInit {
  public terminalData = [
    {
      id: 1,
      name: 'IVS DRIVER CENTER',
      phone: '(123) 456-7890',
      email: 'contact@windsor-brokers.com',
      address: '5462 N East River Rd apt 611 Chicago, IL 60656',
      companyOwned: 'assets/svg/common/ic_company.svg',
      options: [
        {
          id: 1,
          name: 'Office',
          check: true,
          phone: '(123) 456-7890',
          phone_ext: '1234',
          email: 'contact@windsor-brokers.com',
        },
        {
          id: 2,
          name: 'Dispatch Department',
          check: true,
          phone: '(123) 456-7890',
          phone_ext: '1234',
          email: 'contact@windsor-brokers.com',
        },
        {
          id: 3,
          name: 'Safety Department',
          check: true,
          phone: '(123) 456-7890',
          phone_ext: '1234',
          email: 'contact@windsor-brokers.com',
        },
        {
          id: 4,
          name: 'Warehouse',
          check: true,
          phone: '(123) 456-7890',
          phone_ext: '1234',
          email: 'contact@windsor-brokers.com',
        },
        {
          id: 5,
          name: 'Parking',
          check: true,
          phone: '(123) 456-7890',
          parking_slot: 12,
          parking_slot_full: 5,
          gate: true,
          security_camera: true,
        },
        {
          id: 6,
          name: 'Fuel Station',
          check: true,
        },
      ],
    },
    {
      id: 1,
      name: 'Alexandro Castor Office',
      phone: '(123) 456-7890',
      email: 'contact@windsor-brokers.com',
      address: 'East River Rd apt 611, Chicago, IL 60656 ',
      companyOwned: '',
      options: [
        {
          id: 1,
          name: 'Office',
          check: false,
          phone: '',
          phone_ext: '',
          email: '',
        },
        {
          id: 2,
          name: 'Dispatch Department',
          check: true,
          phone: '(123) 456-7890',
          phone_ext: '1234',
          email: 'contact@windsor-brokers.com',
        },
        {
          id: 3,
          name: 'Safety Department',
          check: false,
          phone: '',
          phone_ext: '',
          email: '',
        },
        {
          id: 4,
          name: 'Warehouse',
          check: true,
          phone: '(123) 456-7890',
          phone_ext: '1234',
          email: 'contact@windsor-brokers.com',
        },
        {
          id: 5,
          name: 'Parking',
          check: true,
          phone: '(123) 456-7890',
          parking_slot: 12,
          parking_slot_full: 5,
          gate: true,
          security_camera: true,
        },
        {
          id: 6,
          name: 'Fuel Station',
          check: false,
        },
      ],
    },
  ];
  public terminalPhone: boolean[] = [];
  public terminalEmail: boolean[] = [];
  public departmentPhone: boolean[] = [];
  public departmentEmail: boolean[] = [];
  constructor(
    private settingsStoreService: SettingsStoreService,
    private clipboar: Clipboard
  ) {}

  ngOnInit() {}
  public onAction(modal: { modalName: string; type: string; company?: any }) {
    this.settingsStoreService.onModalAction(modal);
  }

  public identityTerminalData(index: number, item: any): number {
    return item.id;
  }

  public identityCardData(index: number, item: any): number {
    return item.id;
  }

  /* To copy any Text */
  public copyText(val: any, index: number, name: string) {
    switch (name) {
      case 'terminal-phone':
        this.terminalPhone[index] = true;
        break;
      case 'terminal-email':
        this.terminalEmail[index] = true;
        break;
      case 'department-phone':
        this.departmentPhone[index] = true;
        break;
      case 'department-email':
        this.departmentEmail[index] = true;
        break;
    }

    this.clipboar.copy(val);
  }
}
