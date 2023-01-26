import { Injectable } from '@angular/core';
import { PayrollStore } from './payroll.store';
import { PayrollService } from 'appcoretruckassist';
import { Observable } from 'rxjs';
import { CreateResponse } from '../../../../../../../../appcoretruckassist/model/createResponse';
import { PayrollCreditModalResponse } from '../../../../../../../../appcoretruckassist/model/payrollCreditModalResponse';
import { CreatePayrollCreditCommand } from '../../../../../../../../appcoretruckassist/model/createPayrollCreditCommand';
import { UpdatePayrollCreditCommand } from '../../../../../../../../appcoretruckassist/model/updatePayrollCreditCommand';
import { PayrollCreditResponse } from '../../../../../../../../appcoretruckassist/model/payrollCreditResponse';

@Injectable({ providedIn: 'root' })
export class PayrollCreditService {
    constructor(
        private payrollStore: PayrollStore,
        private payrollService: PayrollService
    ) {}

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
}
