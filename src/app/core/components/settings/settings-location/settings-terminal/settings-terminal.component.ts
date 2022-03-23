import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-terminal',
  templateUrl: './settings-terminal.component.html',
  styleUrls: ['./settings-terminal.component.scss']
})
export class SettingsTerminalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  public onAction(data: { modalName: string, type: boolean, action: string }) {
    
  }
}
