import { Component, OnInit } from '@angular/core';

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
      address: '5462 N East River Rd apt 611 Chicago, IL 60656',
      parking_slot: 12,
      parking_slot_full: 5,
      companyOwned: 'assets/img/svgs/settings-company/settings-company-owned.svg',
      gate: true,
      security_camera: false,
      rent: '350$',
      pay_period: 'Monthly',
      day: '5th',
    },
  ];

  constructor() {}

  ngOnInit() {}

  public onAction(data: { modalName: string; type: boolean; action: string }) {}

  public identity(index: number, item: any): number {
    return item.id;
  }

  public calculateParkingSlots(item: any): string {
    return (item.parking_slot + item.parking_slot_full).toString()
  }
}
