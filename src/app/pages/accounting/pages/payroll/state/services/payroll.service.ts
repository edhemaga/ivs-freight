import { Store, select } from '@ngrx/store';

import * as PayrollActions from '../actions/payroll.actions';
import { selectPayrollCounts } from '../selectors/payroll.selector';
import { Observable } from 'rxjs';
import { PayrollCountsResponse } from 'appcoretruckassist';
import { Injectable } from '@angular/core';
import { IPayrollCountsSelector } from '../models/payroll.model';
@Injectable({
    providedIn: 'root',
})
export class PayrollFacadeService {
    constructor(private store: Store) {}

    // Selectors
    public selectPayrollCounts$: Observable<IPayrollCountsSelector> =
        this.store.pipe(select(selectPayrollCounts));

    public getPayrollCounts(showOpen: boolean) {
        this.store.dispatch(
            PayrollActions.getPayrollCounts({ ShowOpen: showOpen })
        );
    }
}
