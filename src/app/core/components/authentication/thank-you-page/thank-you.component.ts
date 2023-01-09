import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import moment from 'moment';

@Component({
    selector: 'app-thank-you-component',
    templateUrl: './thank-you.component.html',
    styleUrls: ['./thank-you.component.scss'],
})
export class ThankYouComponent implements OnInit, OnDestroy {
    public email: string;

    public copyrightYear: number;

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.checkIsValidInit();

        this.copyrightYear = moment().year();
    }

    private checkIsValidInit(): void {
        this.email = JSON.parse(localStorage.getItem('thankYouEmail'));

        if (!this.email) {
            this.router.navigate(['/auth']);

            return;
        }
    }

    ngOnDestroy(): void {
        localStorage.removeItem('thankYouEmail');
    }
}
