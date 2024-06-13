import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

// modules
import { SharedModule } from '@shared/shared.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-applicant-delete-btn',
    templateUrl: './applicant-delete-btn.component.html',
    styleUrls: ['./applicant-delete-btn.component.scss'],
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule, SharedModule],
})
export class ApplicantDeleteBtnComponent implements OnInit {
    @Input() filledValid: boolean;
    @Input() filledInvalid: boolean;

    constructor() {}

    ngOnInit(): void {}
}
