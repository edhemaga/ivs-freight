import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// store
import { ApplicantTableStore } from '@pages/driver/state/applicant-state/applicant-table.store';

// models
import {
    ApplicantAdminResponse,
    ApplicantListResponse,
    ApplicantService as ApplicantBackendService,
    CreateApplicantCommand,
    DriverListResponse,
    ResendInviteCommand,
    UpdateApplicantCommand,
} from 'appcoretruckassist';

// enums
import { EGeneralActions } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class ApplicantService {
    constructor(
        private applicantService: ApplicantBackendService,
        private tableService: TruckassistTableService,
        private applicantStore: ApplicantTableStore
    ) {}

    public addApplicantAdmin(data: CreateApplicantCommand): Observable<object> {
        return this.applicantService.apiApplicantAdminCreatePost(data).pipe(
            tap((res: any) => {
                const subApplicant = this.getApplicantByIdAdmin(
                    res.id
                ).subscribe({
                    next: (applicant: ApplicantAdminResponse | any) => {
                        this.applicantStore.add(applicant);
                        const applicantCount = JSON.parse(
                            localStorage.getItem('accountTableCount')
                        );

                        applicantCount.account++;

                        localStorage.setItem(
                            'accountTableCount',
                            JSON.stringify({
                                account: applicantCount.account,
                            })
                        );

                        this.tableService.sendActionAnimation({
                            animation: EGeneralActions.ADD,
                            data: applicant,
                            id: applicant.id,
                        });

                        subApplicant.unsubscribe();
                    },
                });
            })
        );
    }

    public updateApplicantAdmin(
        data: UpdateApplicantCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantAdminUpdatePut(data);
    }

    // Get Applicant Admin List
    public getApplicantAdminList(
        applicantSpecParamsArchived?: boolean,
        applicantSpecParamsHired?: boolean,
        applicantSpecParamsFavourite?: boolean,
        applicantSpecParamsPageIndex?: number,
        applicantSpecParamsPageSize?: number,
        applicantSpecParamsCompanyId?: number,
        applicantSpecParamsSort?: string,
        applicantSpecParamsSearch?: string,
        applicantSpecParamsSearch1?: string,
        applicantSpecParamsSearch2?: string
    ): Observable<DriverListResponse | ApplicantListResponse> {
        return this.applicantService.apiApplicantAdminListGet(
            applicantSpecParamsArchived,
            applicantSpecParamsHired,
            applicantSpecParamsFavourite,
            applicantSpecParamsPageIndex,
            applicantSpecParamsPageSize,
            applicantSpecParamsCompanyId,
            applicantSpecParamsSort,
            null,
            null,
            applicantSpecParamsSearch,
            applicantSpecParamsSearch1,
            applicantSpecParamsSearch2
        );
    }

    public resendApplicantInviteAdmin(
        data: ResendInviteCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantAdminResendInvitePost(data);
    }

    public getApplicantByIdAdmin(
        id: number
    ): Observable<ApplicantAdminResponse> {
        return this.applicantService.apiApplicantAdminIdGet(id);
    }
}
