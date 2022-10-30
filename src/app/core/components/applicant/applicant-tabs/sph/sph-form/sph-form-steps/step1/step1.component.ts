import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { mergeMap, Observable, Subject, takeUntil, forkJoin, take } from 'rxjs';

import { ApplicantActionsService } from 'src/app/core/components/applicant/state/services/applicant-actions.service';

import { ApplicantSphFormStore } from 'src/app/core/components/applicant/state/store/applicant-sph-form-store/applicant-sph-form.store';
import { ApplicantSphFormQuery } from 'src/app/core/components/applicant/state/store/applicant-sph-form-store/applicant-sph-form.query';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private applicantActionsService: ApplicantActionsService,
    private applicantSphFormStore: ApplicantSphFormStore,
    private applicantSphFormQuery: ApplicantSphFormQuery
  ) {}

  ngOnInit(): void {
    this.applicantSphFormQuery.verifyData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (!res) {
          this.getQueryParams();
        }
      });
  }

  public getQueryParams(): void {
    const queryParams$ = this.route.queryParams.pipe(take(1));

    const verifyEmployer$ = queryParams$.pipe(
      mergeMap((params) =>
        this.verifyPreviousEmployer({
          inviteCode: params['InviteCode']?.split(' ').join('+'),
        })
      )
    );

    forkJoin({ params: queryParams$, verifyEmployer: verifyEmployer$ })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        const verifyData = {
          inviteCode: /\s/.test(res.params.InviteCode)
            ? res.params.InviteCode.split(' ').join('+')
            : res.params.InviteCode,
        };

        this.applicantSphFormStore.update(1, (entity) => {
          return {
            ...entity,
            companyInfo: res.verifyEmployer.companyInfo,
            verifyData,
          };
        });
      });
  }

  public verifyPreviousEmployer(params: any): Observable<any> {
    return this.applicantActionsService.verifyPreviousEmployerSphForm(params);
  }

  public onGetStarted(): void {
    this.router.navigate(['/applicant/previousemployer/welcome/2']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
