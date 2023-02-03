import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { WebsiteAuthService } from 'src/app/core/components/website/state/service/website-auth.service';

import { ConstantString } from 'src/app/core/components/website/state/enum/const-string.enum';

@Component({
    selector: 'app-reset-password-helper',
    templateUrl: './reset-password-helper.component.html',
    styleUrls: ['./reset-password-helper.component.scss'],
})
export class ResetPasswordHelperComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    private verifyData: { emailHash: string; code: string };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private websiteAuthService: WebsiteAuthService
    ) {}

    ngOnInit(): void {
        this.checkIsValidInit();
    }

    private checkIsValidInit(): void {
        let isValid: boolean;

        this.route.queryParams.subscribe((params) => {
            if (!params[ConstantString.EMAIL_HASH]) {
                this.router.navigate([ConstantString.WEBSITE]);

                isValid = false;

                return;
            }

            this.verifyData = {
                emailHash: params[ConstantString.EMAIL_HASH]
                    .split(' ')
                    .join('+'),
                code: params[ConstantString.CODE].split(' ').join('+'),
            };

            isValid = true;
        });

        if (isValid) {
            this.websiteAuthService
                .verifyResetPassword(this.verifyData)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
