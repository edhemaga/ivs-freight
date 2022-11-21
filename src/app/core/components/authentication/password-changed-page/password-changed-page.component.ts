import { Component, OnInit } from '@angular/core';

import moment from 'moment';
@Component({
  selector: 'app-password-changed-page',
  templateUrl: './password-changed-page.component.html',
  styleUrls: ['./password-changed-page.component.scss'],
})
export class PasswordChangedPageComponent implements OnInit {
  public copyrightYear: number;

  constructor() {}

  ngOnInit(): void {
    this.copyrightYear = moment().year();
  }
}
