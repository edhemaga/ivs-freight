import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    PayrollCountsResponse,
    PayrollDriverCommissionByIdResponse,
    PayrollDriverMileageListResponse,
} from 'appcoretruckassist';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    IAddPayrollClosedPayment,
    PayrollDriverMileageCollapsedListResponse,
    PayrollDriverMileageExpandedListResponse,
} from '../state/models/payroll.model';
import { IDriverOwnerList } from '../state/models/driver_owner.model';
import { IDriverCommissionList } from '../state/models/driver_commission.model';
import { IDriverFlatRateList } from '../state/models/driver_flat_rate.model';
import { IGet_Payroll_Commission_Driver_Report } from '../state/models/payroll.model';

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

    public addPayrollMileageDriverPayment(
        data: IAddPayrollClosedPayment
    ): Observable<boolean> {
        const body = {
            ...data,
            type: data.paymentType,
        };

        return this.http.post<boolean>(
            `${environment.API_ENDPOINT}/api/payroll/payment`,
            body
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

    public getPayrollSoloMileageDriverClosedById(payrollId: number) {
        return this.http.get<any>(
            `${environment.API_ENDPOINT}/api/payroll/driver/mileage/closed/${payrollId}`
        );
    }

    // COMMISSION DRIVER

    public getPayrollCommissionDriverList(): Observable<IDriverCommissionList> {
        return this.http.get<IDriverCommissionList>(
            `${environment.API_ENDPOINT}/api/payroll/driver/commission/list`
        );
    }

    public closePayrollCommissionDriverReport(
        amount: number,
        reportId: number,
        selectedLoadIds?: number[],
        selectedDeducionIds?: number[],
        selectedCreditIds?: number[],
        paymentType?: string,
        otherPaymentType?: string
    ): Observable<PayrollDriverMileageResponse> {
        const body = {
            id: reportId,
            selectedDeducionIds: selectedDeducionIds,
            selectedLoadIds: selectedLoadIds,
            selectedCreditIds: selectedCreditIds,
            pay: {
                type: paymentType,
                otherPaymentType,
                //date: '2024-10-15T16:09:54.299Z',
                amount: amount,
            },
        };
        return this.http.put<PayrollDriverMileageResponse>(
            `${environment.API_ENDPOINT}/api/payroll/driver/mileage/close`,
            body
        );
    }

    // FLAT RATE DRIVER
    public getFlatRatePayrollDriverList(): Observable<IDriverFlatRateList> {
        return this.http.get<IDriverFlatRateList>(
            `${environment.API_ENDPOINT}/api/payroll/driver/flatrate/list`
        );
    }

    // OWNER DRIVER
    public getPayrollOwnerDriverList(): Observable<IDriverOwnerList> {
        return this.http.get<IDriverOwnerList>(
            `${environment.API_ENDPOINT}/api/payroll/owner/list/open`
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
        selectedBonusIds?: number[],
        paymentType?: string,
        otherPaymentType?: string
    ): Observable<PayrollDriverMileageResponse> {
        const body = {
            id: reportId,
            lastLoadDate: lastLoadDate,
            selectedDeductionIds: selectedDeducionIds,
            selectedCreditIds: selectedCreditIds,
            selectedBonusIds: selectedBonusIds,
            pay: {
                type: paymentType,
                otherPaymentType,
                //date: '2024-10-15T16:09:54.299Z',
                amount: amount,
            },
        };
        return this.http.put<PayrollDriverMileageResponse>(
            `${environment.API_ENDPOINT}/api/payroll/driver/mileage/close`,
            body
        );
    }

    public getPayrollCommissionDriverReport({
        reportId,
        selectedCreditIds,
        selectedDeductionIds,
        selectedLoadIds,
    }: IGet_Payroll_Commission_Driver_Report): Observable<PayrollDriverCommissionByIdResponse> {
        let params = new HttpParams();

        if (selectedLoadIds) {
            selectedLoadIds.map(
                (creditId) =>
                    (params = params.append('SelectedLoadIds', creditId))
            );
        }
        if (selectedCreditIds) {
            selectedCreditIds.map(
                (creditId) =>
                    (params = params.append('SelectedCreditIds', creditId))
            );
        }

        if (selectedDeductionIds) {
            selectedDeductionIds.map(
                (deductionId) =>
                    (params = params.append(
                        'SelectedDeductionIds',
                        deductionId
                    ))
            );
        }

        return this.http.get<PayrollDriverCommissionByIdResponse>(
            `${environment.API_ENDPOINT}/api/payroll/driver/commission/${reportId}`,
            { params }
        );
    }
}
