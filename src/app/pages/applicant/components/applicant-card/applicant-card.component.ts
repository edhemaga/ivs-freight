import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

// models
import { PersonalInfoFeedbackResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-applicant-card',
    templateUrl: './applicant-card.component.html',
    styleUrls: ['./applicant-card.component.scss'],
    standalone: true,
    imports: [
      // modules
      CommonModule,
  ],
})
export class ApplicantCardComponent implements OnInit {
    @Input() selectedMode: string;
    @Input() applicantCardInfo: PersonalInfoFeedbackResponse

    constructor() {}

    ngOnInit() {}
}
