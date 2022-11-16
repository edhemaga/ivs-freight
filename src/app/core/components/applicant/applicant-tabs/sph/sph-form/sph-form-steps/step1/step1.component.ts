import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { convertDateFromBackend } from 'src/app/core/utils/methods.calculations';

import { ApplicantQuery } from 'src/app/core/components/applicant/state/store/applicant.query';

import { SphPreviousEmployerProspectResponse } from 'appcoretruckassist';

@Component({
   selector: 'app-step1',
   templateUrl: './step1.component.html',
   styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit, OnDestroy {
   private destroy$ = new Subject<void>();

   public completedByProspectiveEmployderCard: any;
   public completedByDriverCard: any;

   constructor(
      private router: Router,
      private applicantQuery: ApplicantQuery
   ) {}

   ngOnInit(): void {
      this.getStepValuesFromStore();
   }

   public getStepValuesFromStore(): void {
      this.applicantQuery.applicantSphForm$
         .pipe(takeUntil(this.destroy$))
         .subscribe((res: SphPreviousEmployerProspectResponse) => {
            if (res) {
               this.patchStepValues(res);
            }
         });
   }

   public patchStepValues(
      stepValues: SphPreviousEmployerProspectResponse
   ): void {
      const {
         employerName,
         employerPhone,
         employerEmail,
         employerFax,
         employerAddress,
         employeeName,
         employeeSsn,
         employeeDoB,
         dateFrom,
         dateTo,
         reasonForLeaving,
         vehicleType,
      } = stepValues;

      this.completedByProspectiveEmployderCard = {
         employerName,
         employerPhone,
         employerEmail,
         employerFax,
         employerAddress,
         employeeName,
         employeeSsn,
         employeeDoB: convertDateFromBackend(employeeDoB),
      };

      this.completedByDriverCard = {
         dateFrom: convertDateFromBackend(dateFrom),
         dateTo: convertDateFromBackend(dateTo),
         reasonForLeaving,
         vehicleType,
      };
   }

   public onGetStarted(): void {
      this.router.navigate(['/sph-form/1/2']);
   }

   ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
   }
}
