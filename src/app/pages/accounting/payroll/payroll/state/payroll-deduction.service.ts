import { Injectable } from '@angular/core';
import { PayrollStore } from './payroll.store';
import { PayrollService } from 'appcoretruckassist';
import { Observable } from 'rxjs';
import { CreateResponse } from '../../../../../../../../appcoretruckassist/model/createResponse';
import { PayrollDeductionModalResponse } from '../../../../../../../../appcoretruckassist/model/payrollDeductionModalResponse';
import { CreatePayrollDeductionCommand } from '../../../../../../../../appcoretruckassist/model/createPayrollDeductionCommand';
import { UpdatePayrollDeductionCommand } from '../../../../../../../../appcoretruckassist/model/updatePayrollDeductionCommand';
import { PayrollDeductionResponse } from '../../../../../../../../appcoretruckassist/model/payrollDeductionResponse';

@Injectable({ providedIn: 'root' })
export class PayrollDeductionService {
    constructor(
        private payrollStore: PayrollStore,
        private payrollService: PayrollService
    ) {}

    public getPayrollDeductionModal(): Observable<PayrollDeductionModalResponse> {
        return this.payrollService.apiPayrollDeductionModalGet();
    }

    public addPayrollDeduction(
        data: CreatePayrollDeductionCommand
    ): Observable<CreateResponse> {
        return this.payrollService.apiPayrollDeductionPost(data);
    }

    public updatePayrollDeduction(
        data: UpdatePayrollDeductionCommand
    ): Observable<any> {
        return this.payrollService.apiPayrollDeductionPut(data);
    }

    public getPayrollDeductionById(
        id: number
    ): Observable<PayrollDeductionResponse> {
        return this.payrollService.apiPayrollDeductionIdGet(id);
    }

    public deletePayrollDeductionById(id: number): Observable<any> {
        return this.payrollService.apiPayrollDeductionIdDelete(id);
    }
}
