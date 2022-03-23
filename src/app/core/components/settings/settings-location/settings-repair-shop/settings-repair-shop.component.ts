import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-repair-shop',
  templateUrl: './settings-repair-shop.component.html',
  styleUrls: ['./settings-repair-shop.component.scss']
})
export class SettingsRepairShopComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  public onAction(data: { modalName: string, type: boolean, action: string }) {
    
  }
}
