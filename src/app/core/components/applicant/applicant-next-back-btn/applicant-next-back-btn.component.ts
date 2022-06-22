import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-applicant-next-back-btn',
  templateUrl: './applicant-next-back-btn.component.html',
  styleUrls: ['./applicant-next-back-btn.component.scss'],
})
export class ApplicantNextBackBtnComponent implements OnInit {
  @Input() disabledStep: boolean;
  @Input() nextStep: boolean;
  @Input() backStep: boolean;
  @Input() lastStep: boolean;
  @Input() lastPage: boolean;

  public filledCorrectly: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
