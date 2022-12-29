import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ta-pickup-delivery',
  templateUrl: './ta-pickup-delivery.component.html',
  styleUrls: ['./ta-pickup-delivery.component.scss']
})
export class TaPickupDeliveryComponent implements OnInit {

  @Input() customWidth: number = 340;

  pickupDeliveryTabs = [
      {
          name: 'Closed',
          counter: 5,
      },
      {
          name: 'Active',
          checked: true,
      },
      {
          name: 'Pending',
      }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  changeTabs(ev: any) {
    console.log('tab switch');
  }

}
