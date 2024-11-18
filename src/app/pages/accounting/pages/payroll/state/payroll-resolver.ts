import { Injectable } from '@angular/core';

import { Observable, of, tap } from 'rxjs';

// Services

@Injectable({
    providedIn: 'root',
})
export class PayrolldResolver {
    constructor() {}

    resolve(): Observable<any> {
        return of(true);
        //     return this.payrollService.getPayrollList().pipe(
        //         tap((result) => {
        //             this.payrollService.payrollList = result;
        //         })
        //     );
    }
}
