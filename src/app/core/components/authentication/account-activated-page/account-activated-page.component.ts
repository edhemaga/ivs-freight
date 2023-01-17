import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import moment from 'moment';

import { AuthSecurityService } from './../state/auth-security.service';

@Component({
    selector: 'app-account-activated-page',
    templateUrl: './account-activated-page.component.html',
    styleUrls: ['./account-activated-page.component.scss'],
})
export class AccountActivatedPageComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public copyrightYear: number;

    public isValidLoad: boolean;

    constructor(
        private authSecurityService: AuthSecurityService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.checkIsValidInit();

        this.copyrightYear = moment().year();
    }

    private checkIsValidInit(): void {
        this.authSecurityService.getAccountActivatedSubject$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (!res) {
                    this.isValidLoad = false;

                    this.router.navigate(['/auth']);

                    return;
                } else {
                    this.isValidLoad = true;
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
