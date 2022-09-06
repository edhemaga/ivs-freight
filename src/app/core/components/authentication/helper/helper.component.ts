import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthStoreService } from '../state/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss'],
})
export class HelperComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private verifyData: { emailHash: string; code: string };

  constructor(
    private route: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.verifyData = {
        emailHash: params['EmailHash'],
        code: params['Code'],
      };
    });

    this.verifyData = {
      emailHash: this.verifyData.emailHash.split(' ').join('+'),
      code: this.verifyData.code.split(' ').join('+'),
    };

    this.onVerifyOwner();
  }

  private onVerifyOwner(): void {
    this.authStoreService
      .verifyOwner(this.verifyData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notification.success('Verifying successful', 'Success');
          this.router.navigate(['/auth/register/account-activated']);
        },
        error: () => {
          this.notification.error('Verifying unsuccessful', 'Error');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
