import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { WebsiteAuthStoreService } from 'src/app/core/components/website/state/service/website-auth-store.service';

import { ConstantString } from 'src/app/core/components/website/state/enum/const-string.enum';

@Component({
    selector: 'app-register-company-helper',
    templateUrl: './register-company-helper.component.html',
    styleUrls: ['./register-company-helper.component.scss'],
})
export class RegisterCompanyHelperComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    private verifyData: { emailHash: string; code: string };

    constructor(
        private websiteAuthStoreService: WebsiteAuthStoreService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.checkIsValidInit();
    }

    private checkIsValidInit(): void {
        let isValid: boolean;

        this.route.queryParams.subscribe((params) => {
            if (!params[ConstantString.EMAIL_HASH]) {
                this.router.navigate([ConstantString.AUTH]);

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
            this.websiteAuthStoreService
                .registerCompanyVerifyOwner(this.verifyData)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
