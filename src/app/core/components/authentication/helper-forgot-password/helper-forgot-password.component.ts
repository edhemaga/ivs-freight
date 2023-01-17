import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { AuthStoreService } from '../state/auth.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { AuthSecurityService } from '../state/auth-security.service';

@Component({
    selector: 'app-helper-forgot-password',
    templateUrl: './helper-forgot-password.component.html',
    styleUrls: ['./helper-forgot-password.component.scss'],
})
export class HelperForgotPasswordComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    private verifyData: { emailHash: string; code: string };

    constructor(
        private route: ActivatedRoute,
        private authStoreService: AuthStoreService,
        private notification: NotificationService,
        private router: Router,
        private authSecurityService: AuthSecurityService
    ) {}

    ngOnInit(): void {
        this.checkIsValidInit();
    }

    private checkIsValidInit(): void {
        let isValid: boolean;

        this.route.queryParams.subscribe((params) => {
            if (!params['EmailHash']) {
                this.router.navigate(['/auth']);

                isValid = false;

                return;
            }

            this.verifyData = {
                emailHash: params['EmailHash'].split(' ').join('+'),
                code: params['Code'].split(' ').join('+'),
            };

            isValid = true;
        });

        if (isValid) {
            this.authStoreService
                .verifyForgotPassword(this.verifyData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res: any) => {
                        this.authStoreService.getForgotPasswordToken(res.token);

                        this.authSecurityService.updateAccountActivatedSubject(
                            true
                        );

                        this.notification.success(
                            'Verifying successful',
                            'Success'
                        );

                        this.router.navigate([
                            '/auth/forgot-password/create-new-password',
                        ]);
                    },
                    error: () => {
                        this.notification.error(
                            'Verifying unsuccessful',
                            'Error'
                        );
                    },
                });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
