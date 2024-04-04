import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, tap } from 'rxjs';

// Services
import { PayrollService } from '../../../services/payroll.service';

@Injectable({
    providedIn: 'root',
})
export class PayrolldResolver implements Resolve<any> {
    constructor(private payrollService: PayrollService) {}

    resolve(): Observable<any> {
        return this.payrollService.getPayrollList().pipe(
            tap((result) => {
                this.payrollService.payrollList = result;
            })
        );
    }
}
