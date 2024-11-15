import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Services
import { PayrollService } from 'appcoretruckassist';

// Models
import { PayrollBonusModalResponse } from 'appcoretruckassist';
import { CreatePayrollBonusCommand } from 'appcoretruckassist';
import { CreateResponse } from 'appcoretruckassist';
import { UpdatePayrollBonusCommand } from 'appcoretruckassist';
import { PayrollBonusResponse } from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class PayrollBonusService {
    constructor(private payrollService: PayrollService) {}

    public getPayrollBonusModal(): Observable<PayrollBonusModalResponse> {
        return this.payrollService.apiPayrollBonusModalGet();
    }

    public addPayrollBonus(
        data: CreatePayrollBonusCommand
    ): Observable<CreateResponse> {
        return this.payrollService.apiPayrollBonusPost(data);
    }

    public updatePayrollBonus(
        data: UpdatePayrollBonusCommand
    ): Observable<any> {
        return this.payrollService.apiPayrollBonusPut(data);
    }

    public getPayrollBonusById(id: number): Observable<PayrollBonusResponse> {
        return this.payrollService.apiPayrollBonusIdGet(id);
    }

    public deletePayrollBonusById(id: number): Observable<any> {
        return this.payrollService.apiPayrollBonusIdDelete(id);
    }

    public movePayrollBonus(id: number): Observable<any> {
        return this.payrollService.apiPayrollBonusMoveIdPut(id);
    }
}
