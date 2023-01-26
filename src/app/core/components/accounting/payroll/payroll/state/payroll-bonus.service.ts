import { Injectable } from '@angular/core';
import { PayrollStore } from './payroll.store';
import { PayrollService } from 'appcoretruckassist';
import { PayrollBonusModalResponse } from '../../../../../../../../appcoretruckassist/model/payrollBonusModalResponse';
import { Observable } from 'rxjs';
import { CreatePayrollBonusCommand } from '../../../../../../../../appcoretruckassist/model/createPayrollBonusCommand';
import { CreateResponse } from '../../../../../../../../appcoretruckassist/model/createResponse';
import { UpdatePayrollBonusCommand } from '../../../../../../../../appcoretruckassist/model/updatePayrollBonusCommand';
import { PayrollBonusResponse } from '../../../../../../../../appcoretruckassist/model/payrollBonusResponse';

@Injectable({ providedIn: 'root' })
export class PayrollBonusService {
    constructor(
        private payrollStore: PayrollStore,
        private payrollService: PayrollService
    ) {}

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
}
