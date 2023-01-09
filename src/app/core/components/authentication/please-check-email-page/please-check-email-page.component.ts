import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import moment from 'moment';

@Component({
    selector: 'app-please-check-email-page',
    templateUrl: './please-check-email-page.component.html',
    styleUrls: ['./please-check-email-page.component.scss'],
})
export class PleaseCheckEmailPageComponent implements OnInit, OnDestroy {
    public email: string;

    public copyrightYear: number;

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.checkIsValidInit();

        this.copyrightYear = moment().year();
    }

    private checkIsValidInit(): void {
        this.email = JSON.parse(localStorage.getItem('checkEmail'));

        if (!this.email) {
            this.router.navigate(['/auth']);

            return;
        }
    }

    ngOnDestroy(): void {
        localStorage.removeItem('checkEmail');
    }
}
