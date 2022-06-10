import { Component, OnDestroy, OnInit } from '@angular/core';

import moment from 'moment';

@Component({
    selector: 'app-please-check-email-page',
    templateUrl: './please-check-email-page.component.html',
    styleUrls: ['./please-check-email-page.component.scss'],
})
export class PleaseCheckEmailPageComponent implements OnInit, OnDestroy {
    public email: string;
    public copyrightYear: number;

    constructor() {}

    ngOnInit(): void {
        this.email = JSON.parse(localStorage.getItem('checkEmail'));
        this.copyrightYear = moment().year();
    }

    ngOnDestroy(): void {
        localStorage.removeItem('checkEmail');
    }
}
