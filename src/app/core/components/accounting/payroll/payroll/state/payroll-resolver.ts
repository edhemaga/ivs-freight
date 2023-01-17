import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { PayrollStoreService } from './payroll.service';

@Injectable({
    providedIn: 'root',
})
export class PayrolldResolver implements Resolve<any> {
    constructor(private payrollStoreService: PayrollStoreService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        // if( this.dashboardQuery.dashboardStatistics.todayObject ){
        //   return this.dashboardQuery.dashboardStatistics;
        // }else{
        //   return this.dashboardStoreService.getDashboardStats().pipe(
        //       tap(products => {
        //           this.dashboardStoreService.dashStats = products;
        //       })
        //   );
        // }

        // return this.payrollStoreService.getPayrollList().pipe(
        //     tap(
        //         result => {
        //             console.log("HELLO");
        //             console.log(result);
        //         }
        //     )
        // )

        return of(true);
    }
}
