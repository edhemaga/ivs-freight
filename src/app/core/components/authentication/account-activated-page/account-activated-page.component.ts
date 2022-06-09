import { Component, OnInit } from '@angular/core';

import moment from 'moment';

@Component({
    selector: 'app-account-activated-page',
    templateUrl: './account-activated-page.component.html',
    styleUrls: ['./account-activated-page.component.scss'],
})
export class AccountActivatedPageComponent implements OnInit {
    public copyrightYear: number;

    constructor() {}

    ngOnInit(): void {
        this.copyrightYear = moment().year();
    }
}
