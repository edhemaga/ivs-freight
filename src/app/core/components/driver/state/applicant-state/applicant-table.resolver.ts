import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ApplicantTService } from '../applicant.service';
import {
    ApplicantTableState,
    ApplicantTableStore,
} from './applicant-table.store';

@Injectable({
    providedIn: 'root',
})
export class ApplicantTableResolver implements Resolve<ApplicantTableState> {
    constructor(
        private applicantService: ApplicantTService,
        private store: ApplicantTableStore,
        private tableService: TruckassistTableService
    ) {}

    resolve(): Observable<any> {
        return forkJoin([
            this.applicantService.getApplicantAdminList(
                undefined,
                undefined,
                undefined,
                1,
                25
            ),
            this.tableService.getTableConfig(7),
        ])
            .pipe(
                tap(([applicantPagination, tableConfig]) => {
                    localStorage.setItem(
                        'applicantTableCount',
                        JSON.stringify({
                            applicant: applicantPagination.count,
                        })
                    );

                    if (tableConfig) {
                        const config = JSON.parse(tableConfig.config);

                        localStorage.setItem(
                            `table-${tableConfig.tableType}-Configuration`,
                            JSON.stringify(config)
                        );
                    }

                    this.store.set(applicantPagination.pagination.data);
                })
            )
    }
}
