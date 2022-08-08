import { Component, OnInit } from '@angular/core';
import { SettingsLocationService } from '../../state/settings-location.service';
@Component({
  selector: 'app-settings-parking',
  templateUrl: './settings-parking.component.html',
  styleUrls: ['./settings-parking.component.scss'],
})
export class SettingsParkingComponent implements OnInit {
  public parkingData = [
    {
      id: 1,
      name: 'Grant Park South Parking',
      phone: '(123) 456-7890',
      email: 'contact@windsor-brokers.com',
      address: '5462 N East River Rd apt 611, Chicago, IL 60656, USA',
      parking_slot: 12,
      parking_slot_full: 5,
      companyOwned: '',
      gate: false,
      security_camera: false,
      rent: '$350',
      pay_period: 'Monthly',
      day: '5th',
    },
    {
      id: 2,
      name: 'CENTRAL DISTRICT NY',
      phone: '(123) 456-7890',
      email: '',
      address: '5462 N East River Rd apt 611, Chicago, IL 60656,USA',
      parking_slot: 12,
      parking_slot_full: 47,
      companyOwned: 'ic_company.svg',
      gate: true,
      security_camera: true,
      rent: '',
      pay_period: '',
      day: '',
    },
    {
      id: 3,
      name: 'GRAND PARK SOUTH PARKING',
      phone: '',
      email: '',
      address: '5462 N East River Rd apt 611, Chicago, IL 60656, USA',
      parking_slot: 7,
      parking_slot_full: 12,
      companyOwned: '',
      gate: true,
      security_camera: false,
      rent: '$350.000',
      pay_period: 'Weekly',
      day: '25th',
    },
  ];
  public parkingPhone: boolean;
  public parkingEmail: boolean;
  constructor(private settingsLocationService: SettingsLocationService) {}

  ngOnInit() {}

  public onAction(modal: { modalName: string; type: string; company?: any }) {
    this.settingsLocationService.onModalAction(modal);
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  public calculateParkingSlots(item: any): string {
    return (item.parking_slot + item.parking_slot_full).toString();
  }

  public generateTextForProgressBar(data: any): string {
    return data.pay_period + ' Rent ' + `- ${data.rent}`;
  }
}
