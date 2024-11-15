import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Services
import { PayrollService } from 'appcoretruckassist';

// Models
import { CreateResponse } from 'appcoretruckassist';
import { PayrollCreditModalResponse } from 'appcoretruckassist';
import { CreatePayrollCreditCommand } from 'appcoretruckassist';
import { UpdatePayrollCreditCommand } from 'appcoretruckassist';
import { PayrollCreditResponse } from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class PayrollCreditService {
    constructor(private payrollService: PayrollService) {}

    public getPayrollCreditModal(): Observable<PayrollCreditModalResponse> {
        return this.payrollService.apiPayrollCreditModalGet();
    }

    public addPayrollCredit(
        data: CreatePayrollCreditCommand
    ): Observable<CreateResponse> {
        return this.payrollService.apiPayrollCreditPost(data);
    }

    public updatePayrollCredit(
        data: UpdatePayrollCreditCommand
    ): Observable<any> {
        return this.payrollService.apiPayrollCreditPut(data);
    }

    public getPayrollCreditById(id: number): Observable<PayrollCreditResponse> {
        return this.payrollService.apiPayrollCreditIdGet(id);
    }

    public deletePayrollCreditById(id: number): Observable<any> {
        return this.payrollService.apiPayrollCreditIdDelete(id);
    }

    public movePayrollCredit(id: number) : Observable<any> {
        return this.payrollService.apiPayrollCreditMoveIdPut(id);
    }
}
