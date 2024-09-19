import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// Services
import { PayrollService } from '@pages/accounting/services/payroll.service';

@Injectable({
    providedIn: 'root',
})
export class PayrolldResolver  {
    constructor(private payrollService: PayrollService) {}

    resolve() {
        // : Observable<any>
        // return this.payrollService.getPayrollList().pipe(
        //     tap((result) => {
        //         this.payrollService.payrollList = result;
        //     })
        // );
    }
}
