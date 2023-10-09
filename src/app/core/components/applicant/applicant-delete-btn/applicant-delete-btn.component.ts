import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-applicant-delete-btn',
    templateUrl: './applicant-delete-btn.component.html',
    styleUrls: ['./applicant-delete-btn.component.scss'],
})
export class ApplicantDeleteBtnComponent implements OnInit {
    @Input() filledValid: boolean;
    @Input() filledInvalid: boolean;

    constructor() {}

    ngOnInit(): void {}
}
