import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Services
import { PayrollService } from 'appcoretruckassist';

// Models
import { CreateResponse } from 'appcoretruckassist';
import { PayrollDeductionModalResponse } from 'appcoretruckassist';
import { CreatePayrollDeductionCommand } from 'appcoretruckassist';
import { UpdatePayrollDeductionCommand } from 'appcoretruckassist';
import { PayrollDeductionResponse } from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class PayrollDeductionService {
    constructor(private payrollService: PayrollService) {}

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

    public moveDeduction(id: number): Observable<any> {
        return this.payrollService.apiPayrollDeductionMoveIdPut(id);
    }
}
