import { Component, OnInit } from '@angular/core';

import moment from 'moment';

@Component({
  selector: 'app-applicant-footer',
  templateUrl: './applicant-footer.component.html',
  styleUrls: ['./applicant-footer.component.scss'],
})
export class ApplicantFooterComponent implements OnInit {
  public currentYear: string = moment().format('YYYY');

  constructor() {}

  ngOnInit(): void {}
}
