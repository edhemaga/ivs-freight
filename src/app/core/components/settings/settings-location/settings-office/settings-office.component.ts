import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-office',
  templateUrl: './settings-office.component.html',
  styleUrls: ['./settings-office.component.scss']
})
export class SettingsOfficeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  onAction(data: { modalName: string, type: boolean, action: string }) {}
}
