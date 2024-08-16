import { Store } from '@ngrx/store';

import * as PayrollActions from '../actions/payroll.actions';

export class PayrollFacadeService {
    constructor(private store: Store) {}

    public getPayrollCounts(showOpen: boolean) {
        this.store.dispatch(
            PayrollActions.getPayrollCounts({ ShowOpen: showOpen })
        );
    }
}
