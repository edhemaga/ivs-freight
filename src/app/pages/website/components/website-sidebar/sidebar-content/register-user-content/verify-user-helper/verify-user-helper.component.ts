import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, takeUntil, tap } from 'rxjs';

// services
import { WebsiteActionsService } from '@pages/website/services/website-actions.service';
import { WebsiteAuthService } from '@pages/website/services/website-auth.service';

// enums
import { WebsiteStringEnum } from '@pages/website/enums/website-string.enum';

// models
import { UserInfoModel } from '@pages/website/models/user-info.model';

@Component({
    selector: 'app-verify-user-helper',
    templateUrl: './verify-user-helper.component.html',
    styleUrls: ['./verify-user-helper.component.scss'],
})
export class VerifyUserHelperComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    private verifyUserInfo: UserInfoModel = null;

    private verifyData: { emailHash: string; code: string } = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private websiteActionsService: WebsiteActionsService,
        private websiteAuthService: WebsiteAuthService
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

            this.verifyUserInfo = {
                firstName: params[WebsiteStringEnum.FIRST_NAME],
                lastName: params[WebsiteStringEnum.LAST_NAME],
                email: params[WebsiteStringEnum.EMAIL],
            };

            isValid = true;
        });

        if (isValid) {
            this.websiteAuthService
                .registerUserVerifyUser(this.verifyData)
                .pipe(
                    takeUntil(this.destroy$),
                    tap(() => {
                        this.websiteActionsService.setVerifyUserInfoSubject(
                            this.verifyUserInfo
                        );
                    })
                )
                .subscribe();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
