import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// Actions
import * as PayrollOwnerActions from '../actions/payroll_owner_driver.action';

// Selectors
import { selectOwnerListDriver } from '../selectors/payroll_owner.selector';

// Models
import { IDriverOwnerList } from '../models/driver_owner.model';

@Injectable({
    providedIn: 'root',
})
export class PayrollDriverOwnerFacadeService {
    constructor(private store: Store) {}

    public selectOwnerDriverList$: Observable<IDriverOwnerList> =
        this.store.pipe(select(selectOwnerListDriver));

    public getPayrollDriverOwnerList() {
        this.store.dispatch(PayrollOwnerActions.getPayrollOwnerDriverList());
    }
}
