import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthStoreService } from '../state/auth.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-helper-forgot-password',
  templateUrl: './helper-forgot-password.component.html',
  styleUrls: ['./helper-forgot-password.component.scss'],
})
export class HelperForgotPasswordComponent implements OnInit, OnDestroy {
  private verifyData: { emailHash: string; code: string };

  constructor(
    private route: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.verifyData = {
        emailHash: params['EmailHash'],
        code: params['Code'],
      };
    });

    this.verifyData = {
      emailHash: this.verifyData.emailHash.split(' ').join('+'),
      code: this.verifyData.code.split(' ').join('+'),
    };

    this.onVerifyForgotPassword();
  }

  private onVerifyForgotPassword(): void {
    this.authStoreService
      .verifyForgotPassword(this.verifyData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: any) => {
          console.log('helper', res.token);
          this.authStoreService.getForgotPasswordToken(res.token);

          this.notification.success('Verifying successful', 'Success');
          this.router.navigate(['/auth/forgot-password/create-new-password']);
        },
        error: () => {
          this.notification.error('Verifying unsuccessful', 'Error');
        },
      });
  }

  ngOnDestroy(): void {}
}

/*   next: ((res: any) ) => {
          this.notification.success('Verifying successful', 'Success');
          this.router.navigate(['/auth/forgot-password/create-new-password']);

          this.authStoreService.getForgotPasswordToken(res.token);
        },
        error: () => {
          this.notification.error('Verifying unsuccessful', 'Error');
        }, */
