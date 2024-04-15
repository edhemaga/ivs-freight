import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, takeUntil, tap } from 'rxjs';

// services
import { WebsiteAuthService } from '@pages/website/services/website-auth.service';
import { WebsiteActionsService } from '@pages/website/services/website-actions.service';

// enums
import { WebsiteStringEnum } from '@pages/website/enums/website-string.enum';

// models
import { UserInfoModel } from '@pages/website/models/user-info.model';

@Component({
    selector: 'app-reset-password-helper',
    templateUrl: './reset-password-helper.component.html',
    styleUrls: ['./reset-password-helper.component.scss'],
})
export class ResetPasswordHelperComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    private userInfo: UserInfoModel = null;

    private verifyData: { emailHash: string; code: string } = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private websiteAuthService: WebsiteAuthService,
        private websiteActionsService: WebsiteActionsService
    ) {}

    ngOnInit(): void {
        this.checkIsValidInit();
    }

    private checkIsValidInit(): void {
        let isValid: boolean;

        this.route.queryParams.subscribe((params) => {
            if (!params[WebsiteStringEnum.EMAIL_HASH]) {
                this.router.navigate([WebsiteStringEnum.WEBSITE]);

                isValid = false;

                return;
            }

            this.verifyData = {
                emailHash: params[WebsiteStringEnum.EMAIL_HASH]
                    .split(' ')
                    .join('+'),
                code: params[WebsiteStringEnum.CODE].split(' ').join('+'),
            };

            this.userInfo = {
                firstName: params[WebsiteStringEnum.FIRST_NAME],
                lastName: params[WebsiteStringEnum.LAST_NAME],
                email: params[WebsiteStringEnum.EMAIL],
            };

            isValid = true;
        });

        if (isValid) {
            this.websiteAuthService
                .getAccountAvatarImage(this.verifyData.code)
                .pipe(takeUntil(this.destroy$))
                .subscribe();

            setTimeout(() => {
                this.websiteAuthService
                    .verifyResetPassword(this.verifyData)
                    .pipe(
                        takeUntil(this.destroy$),
                        tap(() => {
                            this.websiteActionsService.setCreatePasswordSubject(
                                this.userInfo
                            );
                        })
                    )
                    .subscribe();
            }, 100);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
