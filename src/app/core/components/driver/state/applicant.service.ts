import { Injectable } from '@angular/core';
import {
    ApplicantAdminResponse,
    ApplicantService,
    CreateApplicantCommand,
    GetApplicantListResponse,
    ResendInviteCommand,
    UpdateApplicantCommand,
} from '../../../../../../appcoretruckassist';
import { Observable, tap } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ApplicantTableStore } from './applicant-state/applicant-table.store';

@Injectable({
    providedIn: 'root',
})
export class ApplicantTService {
    constructor(private applicantService: ApplicantService,  private tableService: TruckassistTableService, private applicantStore: ApplicantTableStore) {}

    public addApplicantAdmin(data: CreateApplicantCommand): Observable<object> {
        return this.applicantService.apiApplicantAdminPost(data).pipe(
            tap((res: any) => {
                const subApplicant = this.getApplicantByIdAdmin(res.id)
                    .subscribe({
                        next: (applicant: ApplicantAdminResponse | any) => {
                            this.applicantStore.add(applicant)
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
                                animation: 'add',
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
        return this.applicantService.apiApplicantAdminPut(data);
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
    ): Observable<GetApplicantListResponse> {
        return this.applicantService.apiApplicantAdminListGet(
            applicantSpecParamsArchived,
            applicantSpecParamsHired,
            applicantSpecParamsFavourite,
            applicantSpecParamsPageIndex,
            applicantSpecParamsPageSize,
            applicantSpecParamsCompanyId,
            applicantSpecParamsSort,
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
