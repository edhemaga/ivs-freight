import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// Actions
import * as PayrollFlatRateActions from '../actions/payroll_flat_rate_driver.actions';

// Selectors
import { selectFlatRateListDriver } from '../selectors/payroll_driver_flat_rate.selector';

// Models
import { IDriverFlatRateList } from '../models/driver_flat_rate.model';

@Injectable({
    providedIn: 'root',
})
export class PayrollDriverFlatRateFacadeService {
    constructor(private store: Store) {}

    public selectFlatListDriverList$: Observable<IDriverFlatRateList> =
        this.store.pipe(select(selectFlatRateListDriver));

    public getPayrollDriverFlatRateList() {
        this.store.dispatch(PayrollFlatRateActions.getPayrollFlatRateDriver());
    }
}
