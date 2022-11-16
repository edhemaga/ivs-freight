import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApplicantActionsService } from '../services/applicant-actions.service';

import { ApplicantState, ApplicantStore } from '../store/applicant.store';

@Injectable({
  providedIn: 'root',
})
export class ApplicantResolver implements Resolve<ApplicantState> {
  constructor(
    private applicantActionsService: ApplicantActionsService,
    private applicantStore: ApplicantStore
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<ApplicantState> {
    const applicantData$ = this.applicantActionsService.getApplicantById(
      +route.params.id
    );

    const applicantDropdownList$ =
      this.applicantActionsService.getDropdownLists();

    return forkJoin({
      applicantData: applicantData$,
      applicantDropdownList: applicantDropdownList$,
    }).pipe(
      tap((res: any) => {
        this.applicantStore.update((store) => {
          return {
            ...store,
            applicant: res.applicantData,
            applicantDropdownLists: res.applicantDropdownList,
          };
        });
      })
    );
  }
}
