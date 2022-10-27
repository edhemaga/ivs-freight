import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApplicantState, ApplicantStore } from '../store/applicant.store';
import { ApplicantActionsService } from '../services/applicant-actions.service';
import { ApplicantListsService } from '../services/applicant-lists.service';
import { ApplicantListsStore } from '../store/applicant-lists-store/applicant-lists.store';

@Injectable({
  providedIn: 'root',
})
export class ApplicantResolver implements Resolve<ApplicantState> {
  constructor(
    private applicantActionsService: ApplicantActionsService,
    private applicantListService: ApplicantListsService,
    private applicantStore: ApplicantStore,
    private applicantListsStore: ApplicantListsStore
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<ApplicantState> {
    const applicantData$ = this.applicantActionsService.getApplicantById(
      +route.params.id
    );
    const applicantDropdownList$ = this.applicantListService.getDropdownLists();

    return forkJoin({
      applicantData: applicantData$,
      applicantDropdownList: applicantDropdownList$,
    }).pipe(
      tap((res: any) => {
        this.applicantStore.set({ 1: res.applicantData });
        this.applicantListsStore.set({ 1: res.applicantDropdownList });
      })
    );
  }
}
