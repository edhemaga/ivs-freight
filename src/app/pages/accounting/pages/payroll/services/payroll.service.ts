import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    PayrollCountsResponse,
    PayrollDriverMileageListResponse,
} from 'appcoretruckassist';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PayrollService {
    constructor(public http: HttpClient) {}

    public getPayrollCounts(
        showOpen: boolean
    ): Observable<PayrollCountsResponse> {
        return this.http.get(
            `${environment.API_ENDPOINT}/api/payroll/counts?ShowOpen=${showOpen}`
        );
    }

    public getPayrollSoloMileageDriver(): Observable<
        PayrollDriverMileageListResponse[]
    > {
        return this.http.get<PayrollDriverMileageListResponse[]>(
            `${environment.API_ENDPOINT}/api/payroll/driver/mileage/solo`
        );
    }

    public getPayrollSoloMileageDriverReport(
        reportId: string,
        lastLoadDate: string,
        selectedCreditIds?: number[],
        selectedDeducionIds?: number[],
        selectedBonusIds?: number[]
    ): Observable<PayrollDriverMileageResponse> {
        let params = new HttpParams();
        if (lastLoadDate) {
            params = params.append('LastLoadDate', lastLoadDate);
        }
        if (selectedCreditIds) {
            selectedCreditIds.map(
                (creditId) =>
                    (params = params.append('SelectedCreditIds', creditId))
            );
        }

        if (selectedDeducionIds) {
            selectedDeducionIds.map(
                (deductionId) =>
                    (params = params.append('SelectedDeducionIds', deductionId))
            );
        }

        if (selectedBonusIds) {
            selectedBonusIds.map(
                (bonusId) =>
                    (params = params.append('SelectedBonusIds', bonusId))
            );
        }

        return this.http.get<PayrollDriverMileageResponse>(
            `${environment.API_ENDPOINT}/api/payroll/driver/mileage/${reportId}`,
            { params }
        );
    }
}
