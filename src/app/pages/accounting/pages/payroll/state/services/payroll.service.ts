import { Store, select } from '@ngrx/store';

import * as PayrollActions from '../actions/payroll.actions';
import * as PayrollDriverMileageSolo from '../actions/payroll_solo_mileage_driver.actions';
import {
    selectPayrollCounts,
    selectSoloDriverMileage,
} from '../selectors/payroll.selector';
import { Observable } from 'rxjs';
import {
    PayrollCountsResponse,
    PayrollDriverMileageListResponse,
} from 'appcoretruckassist';
import { Injectable } from '@angular/core';
import { IPayrollCountsSelector } from '../models/payroll.model';
@Injectable({
    providedIn: 'root',
})
export class PayrollFacadeService {
    constructor(private store: Store) {}

    // SELECTORS



    // Select Payroll Counts
    public selectPayrollCounts$: Observable<IPayrollCountsSelector> =
        this.store.pipe(select(selectPayrollCounts));

    // Select Driver Mileage Solo
    public selectPayrollDriverSoloMileage$: Observable<PayrollDriverMileageListResponse[]> =
        this.store.pipe(select(selectSoloDriverMileage));

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
}
