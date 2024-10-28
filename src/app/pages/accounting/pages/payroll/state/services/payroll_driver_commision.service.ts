import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// Actions
import * as PayrollCommissionActions from '../actions/payroll_commission_driver.actions';

// Selectors
import { selectCommissionListDriver } from '../selectors/payroll_driver_commision.selector';

// Models
import { IDriverCommissionList } from '../models/driver_commission.model';

@Injectable({
    providedIn: 'root',
})
export class PayrollDriverCommissionFacadeService {
    constructor(private store: Store) {}

    public selectCommissionDriverList$: Observable<IDriverCommissionList> =
        this.store.pipe(select(selectCommissionListDriver));

    public getPayrollDriverCommissionList() {
        this.store.dispatch(
            PayrollCommissionActions.getPayrollCommissionDriver()
        );
    }
}