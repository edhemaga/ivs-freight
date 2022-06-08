import { Component, HostListener, OnInit } from '@angular/core';

import moment from 'moment';

import { Router } from '@angular/router';

@Component({
    selector: 'app-thank-you-component',
    templateUrl: './thank-you.component.html',
    styleUrls: ['./thank-you.component.scss'],
})
export class ThankYouComponent implements OnInit {
    public email: string = null;
    public copyrightYear: number;

    constructor(private router: Router) {}

    ngOnInit() {
        this.email = JSON.parse(localStorage.getItem('thankYouEmail'));
        this.copyrightYear = moment().year();
    }

    public onSignIn(): void {
        localStorage.removeItem('thankYouEmail');

        this.router.navigate(['/login']);
    }
}
