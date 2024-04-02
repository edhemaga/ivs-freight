import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, takeUntil, tap } from 'rxjs';

// services
import { WebsiteAuthService } from 'src/app/pages/website/services/website-auth.service';
import { WebsiteActionsService } from 'src/app/pages/website/services/website-actions.service';

// enums
import { WebsiteStringEnum } from 'src/app/pages/website/enums/website-string.enum';

// models
import { UserInfoModel } from 'src/app/pages/website/models/user-info.model';

@Component({
    selector: 'app-register-company-helper',
    templateUrl: './register-company-helper.component.html',
    styleUrls: ['./register-company-helper.component.scss'],
})
export class RegisterCompanyHelperComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    private verifyUserInfo: UserInfoModel = null;

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

            this.verifyUserInfo = {
                firstName: params[WebsiteStringEnum.FIRST_NAME],
                lastName: params[WebsiteStringEnum.LAST_NAME],
                email: params[WebsiteStringEnum.EMAIL],
                companyName: params[WebsiteStringEnum.COMPANY_NAME],
            };

            isValid = true;
        });

        if (isValid) {
            this.websiteAuthService
                .registerCompanyVerifyOwner(this.verifyData)
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
