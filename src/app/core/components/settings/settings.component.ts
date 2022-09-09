import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-factoring',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.global.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent {
  constructor(public router: Router) {}
}
