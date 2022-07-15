import { Component, OnInit } from '@angular/core';

import moment from 'moment';

@Component({
  selector: 'app-applicant-footer',
  templateUrl: './applicant-footer.component.html',
  styleUrls: ['./applicant-footer.component.scss'],
})
export class ApplicantFooterComponent implements OnInit {
  public copyrightYear: string;

  public displayInfoBox: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.copyrightYear = moment().format('YYYY');
  }

  public onHideInfoBox(): void {
    this.displayInfoBox = false;
  }

  public onDisplayOrHideInfoBox(): void {
    this.displayInfoBox = !this.displayInfoBox;
  }
}
