import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import moment from 'moment';

import { AuthSecurityService } from '../state/auth-security.service';

@Component({
    selector: 'app-password-changed-page',
    templateUrl: './password-changed-page.component.html',
    styleUrls: ['./password-changed-page.component.scss'],
})
export class PasswordChangedPageComponent implements OnInit {
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
}
