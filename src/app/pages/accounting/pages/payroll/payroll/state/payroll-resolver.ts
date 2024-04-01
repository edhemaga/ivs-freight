import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { PayrollStoreService } from '../../../../services/payroll.service';

@Injectable({
    providedIn: 'root',
})
export class PayrolldResolver implements Resolve<any> {
    constructor(private payrollStoreService: PayrollStoreService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this.payrollStoreService.getPayrollList().pipe(
            tap((result) => {
                this.payrollStoreService.payrollList = result;
            })
        );

        return of(true);
    }
}
