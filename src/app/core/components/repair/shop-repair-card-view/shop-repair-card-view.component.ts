import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-shop-repair-card-view',
  templateUrl: './shop-repair-card-view.component.html',
  styleUrls: ['./shop-repair-card-view.component.scss'],
})
export class ShopRepairCardViewComponent implements OnInit {
  @Input() shopResponse: any;
  @Input() templateCard: boolean;
  public noteControl: FormControl = new FormControl();
  public count: number;
  public tabs:any;
  constructor() {}

  ngOnInit(): void {
    this.noteControl.patchValue('Neki notee');
    this.getActiveServices();
    this.tabsSwitcher();
  }
  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }

  public getActiveServices() {
    let res = this.shopResponse.serviceTypes.filter((item) => item.active);
    this.count = res.length;
    return this.count;
  }
  public tabsSwitcher(){
    this.tabs = [
      {
        id: 223,
        name: '1M',
      },
      {
        name: '3M',
        checked: false,
      },
      {
        id: 412,
        name: '6M',
        checked: false,
      },
      {
        id: 515,
        name: '1Y',
        checked: false,
      },
      {
        id: 1210,
        name: 'YTD',
        checked: false,
      },
      {
        id: 1011,
        name: 'ALL',
        checked: false,
      },
    ];
  }
}
