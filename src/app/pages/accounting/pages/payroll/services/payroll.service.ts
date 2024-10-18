import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    PayrollCountsResponse,
    PayrollDriverMileageListResponse,
} from 'appcoretruckassist';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    PayrollDriverMileageCollapsedListResponse,
    PayrollDriverMileageExpandedListResponse,
} from '../state/models/payroll.model';

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

    public getPayrollSoloMileageDriverCollapsedList(): Observable<
        PayrollDriverMileageListResponse[]
    > {
        return this.http.get<PayrollDriverMileageCollapsedListResponse[]>(
            `${environment.API_ENDPOINT}/api/payroll/driver/mileage/closed/collapsed/list`
        );
    }

    public getPayrollSoloMileageDriverExpandedList(
        driverId: number
    ): Observable<PayrollDriverMileageExpandedListResponse[]> {
        return this.http.get<PayrollDriverMileageExpandedListResponse[]>(
            `${environment.API_ENDPOINT}/api/payroll/driver/mileage/closed/expanded/list?Driverid=${driverId}`
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

    public closePayrollSoloMileageDriverReport(
        amount: number,
        reportId: number,
        lastLoadDate: string,
        selectedCreditIds?: number[],
        selectedDeducionIds?: number[],
        selectedBonusIds?: number[]
    ): Observable<PayrollDriverMileageResponse> {
        const body = {
            id: reportId,
            lastLoadDate: lastLoadDate,
            selectedDeductionIds: selectedDeducionIds,
            selectedCreditIds: selectedCreditIds,
            selectedBonusIds: selectedBonusIds,
            pay: {
                type: 'Manual',
                //date: '2024-10-15T16:09:54.299Z',
                amount: amount,
            },
        };

        console.log('body', body);
        //return of();

        return this.http.put<PayrollDriverMileageResponse>(
            `${environment.API_ENDPOINT}/api/payroll/driver/mileage/close`,
            body
        );
    }
}
