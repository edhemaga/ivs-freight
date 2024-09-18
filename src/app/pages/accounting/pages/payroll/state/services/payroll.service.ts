import { Store, select } from '@ngrx/store';

import * as PayrollActions from '../actions/payroll.actions';
import * as PayrollDriverMileageSolo from '../actions/payroll_solo_mileage_driver.actions';
import {
    selectPayrollCounts,
    selectPayrollDriverMileageStops,
    selectPayrollLoad,
    selectPayrollOpenedReport,
    selectPayrollReportLoading,
    selectSoloDriverMileage,
    seletPayrollTabsCount,
} from '../selectors/payroll.selector';
import { Observable } from 'rxjs';
import {
    MilesStopShortResponse,
    PayrollDriverMileageListResponse,
} from 'appcoretruckassist';
import { Injectable } from '@angular/core';
import { IPayrollCountsSelector } from '../models/payroll.model';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';
@Injectable({
    providedIn: 'root',
})
export class PayrollFacadeService {
    constructor(private store: Store) {}

    // SELECTORS

    // Select Payroll Counts
    public selectPayrollCounts$: Observable<IPayrollCountsSelector> =
        this.store.pipe(select(selectPayrollCounts));

    public payrollLoading$: Observable<boolean> = this.store.pipe(
        select(selectPayrollLoad)
    );

    public payrollReportLoading$: Observable<boolean> = this.store.pipe(
        select(selectPayrollReportLoading)
    );

    public selectPayrollOpenedReport$: Observable<PayrollDriverMileageResponse> =
        this.store.pipe(select(selectPayrollOpenedReport));

    public selectPayrollReportDriverMileageLoads$: Observable<
        MilesStopShortResponse[]
    > = this.store.pipe(select(selectPayrollDriverMileageStops));

    public selectPayrollTabCounts$: Observable<{
        open: number;
        closed: number;
    }> = this.store.pipe(select(seletPayrollTabsCount));

    // Select Driver Mileage Solo
    public selectPayrollDriverSoloMileage$: Observable<
        PayrollDriverMileageListResponse[]
    > = this.store.pipe(select(selectSoloDriverMileage));

    public getPayrollCounts(showOpen: boolean) {
        this.store.dispatch(
            PayrollActions.getPayrollCounts({ ShowOpen: showOpen })
        );
    }

    public getPayrollDriverMileageSoloList() {
        this.store.dispatch(
            PayrollDriverMileageSolo.getPayrollSoloMileageDriver()
        );
    }

    public getPayrollDriverMileageReport(reportId: string) {
        this.store.dispatch(
            PayrollDriverMileageSolo.getPayrollSoloMileageReportDriver({
                reportId,
            })
        );
    }
}
