import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import {
    ClosePayrollDriverCommissionCommand,
    ClosePayrollDriverFlatRateCommand,
    ClosePayrollOwnerCommand,
    PayrollCountsResponse,
    PayrollDriverCommissionByIdResponse,
    PayrollDriverCommissionClosedByIdResponse,
    PayrollDriverFlatRateByIdResponse,
    PayrollDriverFlatRateClosedByIdResponse,
    PayrollDriverMileageListResponse,
    PayrollOtherPaymentType,
    PayrollOwnerClosedResponse,
    PayrollOwnerResponse,
    PayrollPaymentType,
} from 'appcoretruckassist';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';
import {
    IAddPayrollClosedPayment,
    PayrollDriverMileageCollapsedListResponse,
    PayrollDriverMileageExpandedListResponse,
} from '@pages/accounting/pages/payroll/state/models';
import { IDriverOwnerList } from '@pages/accounting/pages/payroll/state/models';
import { IDriverCommissionList } from '@pages/accounting/pages/payroll/state/models';
import { IDriverFlatRateList } from '@pages/accounting/pages/payroll/state/models';
import { IGet_Payroll_Commission_Driver_Report } from '@pages/accounting/pages/payroll/state/models';
import { PayrollDeleteModal } from '@pages/accounting/pages/payroll/state/models';

// Environment
import { environment } from 'src/environments/environment';

// Services
import { ModalService } from '@shared/services/modal.service';

// Components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import {
    PayrollType,
    PayrollTypeEnum,
} from '@pages/accounting/pages/payroll/state/types/payroll.type';
// TODO: Slaviša
// import { PayrollTypeEnum } from 'ca-components/lib/components/ca-period-content/enums';

@Injectable({ providedIn: 'root' })
export class PayrollService {
    constructor(public http: HttpClient, private modalService: ModalService) {}

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
            `${environment.API_ENDPOINT}/api/payroll/driver/mileage/list`
        );
    }

    public generateReport(id: number, type: PayrollType) {
        return this.http.get(
            `${environment.API_ENDPOINT}${this.getReportURL(type)}/${id}`,
            { responseType: 'blob' }
        );
    }

    private getReportURL(type: PayrollType): string {
        if (type === PayrollTypeEnum.OWNER_COMMISSION) {
            return '/api/payroll/owner/report';
        }

        if (type === PayrollTypeEnum.FLAT_RATE) {
            return '/api/payroll/driver/flatrate/report';
        }

        if (type === PayrollTypeEnum.MILEAGE) {
            return '/api/payroll/driver/mileage/report';
        }

        if (type === PayrollTypeEnum.COMMISSION) {
            return '/api/payroll/driver/commission/report';
        }
    }

    public addPayrollClosedReportPayment(
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

    public getPayrollCommissionDriverClosedReportById(payrollId: number) {
        return this.http.get<PayrollDriverCommissionClosedByIdResponse>(
            `${environment.API_ENDPOINT}/api/payroll/driver/commission/closed/${payrollId}`
        );
    }

    public getPayrollCommissionDriverCollapsedList(): Observable<
        PayrollDriverMileageListResponse[]
    > {
        return this.http.get<PayrollDriverMileageCollapsedListResponse[]>(
            `${environment.API_ENDPOINT}/api/payroll/driver/commission/closed/collapsed/list`
        );
    }

    public getPayrollCommissionDriverExpandedList(
        driverId: number
    ): Observable<PayrollDriverMileageExpandedListResponse[]> {
        return this.http.get<PayrollDriverMileageExpandedListResponse[]>(
            `${environment.API_ENDPOINT}/api/payroll/driver/commission/closed/expanded/list?Driverid=${driverId}`
        );
    }

    public closePayrollCommissionDriverReport(
        amount: number,
        reportId: number,
        selectedLoadIds?: number[],
        selectedDeducionIds?: number[],
        selectedCreditIds?: number[],
        paymentType?: PayrollPaymentType,
        otherPaymentType?: PayrollOtherPaymentType
    ): Observable<PayrollDriverMileageResponse> {
        const body: ClosePayrollDriverCommissionCommand = {
            id: reportId,
            pay: {
                type: paymentType,
                otherPaymentType,
                //date: '2024-10-15T16:09:54.299Z',
                amount: amount,
            },
        };

        body.selectedDeducionIds = selectedDeducionIds;

        body.selectedLoadIds = selectedLoadIds;

        body.selectedCreditIds = selectedCreditIds;

        return this.http.put<PayrollDriverMileageResponse>(
            `${environment.API_ENDPOINT}/api/payroll/driver/commission/close`,
            body
        );
    }

    public getPayrollSoloMileageDriverReport(
        reportId: string,
        lastLoadDate: string,
        selectedCreditIds?: number[],
        selectedDeducionIds?: number[]
    ): Observable<PayrollDriverMileageResponse> {
        let params = new HttpParams();
        if (lastLoadDate) {
            params = params.append('LastLoadDate', lastLoadDate);
        }

        if (selectedCreditIds)
            selectedCreditIds.map(
                (creditId) =>
                    (params = params.append('SelectedCreditIds', creditId))
            );
        else if (typeof selectedCreditIds != 'undefined')
            params = params.append(
                'SelectedCreditIds',
                selectedCreditIds.toString()
            );

        if (selectedDeducionIds?.length)
            selectedDeducionIds.map(
                (deductionId) =>
                    (params = params.append('SelectedDeducionIds', deductionId))
            );
        else if (typeof selectedDeducionIds != 'undefined')
            params = params.append(
                'SelectedDeducionIds',
                selectedDeducionIds.toString()
            );

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

        if (selectedLoadIds)
            selectedLoadIds.map(
                (creditId) =>
                    (params = params.append('SelectedLoadIds', creditId))
            );
        else if (typeof selectedLoadIds != 'undefined')
            params = params.append(
                'SelectedLoadIds',
                selectedLoadIds.toString()
            );

        if (selectedCreditIds)
            selectedCreditIds.map(
                (creditId) =>
                    (params = params.append('SelectedCreditIds', creditId))
            );
        else if (typeof selectedCreditIds != 'undefined')
            params = params.append(
                'SelectedCreditIds',
                selectedCreditIds.toString()
            );

        if (selectedDeductionIds)
            selectedDeductionIds.map(
                (deductionId) =>
                    (params = params.append(
                        'SelectedDeductionIds',
                        deductionId
                    ))
            );
        else if (typeof selectedDeductionIds != 'undefined')
            params = params.append(
                'SelectedDeductionIds',
                selectedDeductionIds.toString()
            );

        return this.http.get<PayrollDriverCommissionByIdResponse>(
            `${environment.API_ENDPOINT}/api/payroll/driver/commission/${reportId}`,
            { params }
        );
    }

    // OWNER DRIVER
    public getPayrollOwnerDriverList(): Observable<IDriverOwnerList> {
        return this.http.get<IDriverOwnerList>(
            `${environment.API_ENDPOINT}/api/payroll/owner/list/open`
        );
    }

    public getPayrollOwnerDriverClosedReportById(payrollId: number) {
        return this.http.get<PayrollOwnerClosedResponse>(
            `${environment.API_ENDPOINT}/api/payroll/owner/closed/${payrollId}`
        );
    }

    public getPayrollOwnerDriverExpandedList(
        truckId: number
    ): Observable<PayrollDriverMileageExpandedListResponse[]> {
        return this.http.get<PayrollDriverMileageExpandedListResponse[]>(
            `${environment.API_ENDPOINT}/api/payroll/owner/list/closed/expanded?TruckId=${truckId}`
        );
    }

    public getPayrollOwnerDriverCollapsedList(): Observable<
        PayrollDriverMileageListResponse[]
    > {
        return this.http.get<PayrollDriverMileageCollapsedListResponse[]>(
            `${environment.API_ENDPOINT}/api/payroll/owner/list/closed`
        );
    }

    public getPayrollOwnerDriverReport({
        reportId,
        selectedCreditIds,
        selectedDeductionIds,
        selectedLoadIds,
        selectedFuelIds,
    }: IGet_Payroll_Commission_Driver_Report): Observable<PayrollDriverCommissionByIdResponse> {
        let params = new HttpParams();

        if (selectedLoadIds?.length)
            selectedLoadIds.map(
                (creditId) =>
                    (params = params.append('SelectedLoadIds', creditId))
            );
        else if (typeof selectedLoadIds != 'undefined')
            params = params.append(
                'SelectedLoadIds',
                selectedLoadIds.toString()
            );

        if (selectedCreditIds?.length)
            selectedCreditIds.map(
                (creditId) =>
                    (params = params.append('SelectedCreditIds', creditId))
            );
        else if (typeof selectedCreditIds != 'undefined')
            params = params.append(
                'SelectedCreditIds',
                selectedCreditIds.toString()
            );

        if (selectedDeductionIds?.length)
            selectedDeductionIds.map(
                (deductionId) =>
                    (params = params.append(
                        'SelectedDeductionIds',
                        deductionId
                    ))
            );
        else if (typeof selectedDeductionIds != 'undefined')
            params = params.append(
                'SelectedDeductionIds',
                selectedDeductionIds.toString()
            );

        if (selectedFuelIds?.length)
            selectedFuelIds.map(
                (fuel) => (params = params.append('SelectedFuelIds', fuel))
            );
        else if (typeof selectedFuelIds != 'undefined')
            params = params.append(
                'SelectedFuelIds',
                selectedFuelIds.toString()
            );

        return this.http.get<PayrollOwnerResponse>(
            `${environment.API_ENDPOINT}/api/payroll/owner/open/${reportId}`,
            { params }
        );
    }

    public closePayrollOwnerDriverReport(
        amount: number,
        reportId: number,
        selectedLoadIds?: number[],
        selectedDeducionIds?: number[],
        selectedCreditIds?: number[],
        selectedFuelIds?: number[],
        paymentType?: PayrollPaymentType,
        otherPaymentType?: PayrollOtherPaymentType
    ): Observable<PayrollDriverMileageResponse> {
        const body: ClosePayrollOwnerCommand = {
            id: reportId,
            selectedDeducionIds: selectedDeducionIds,
            selectedLoadIds: selectedLoadIds,
            selectedCreditIds: selectedCreditIds,
            selectedFuelIds: selectedFuelIds,
            pay: {
                type: paymentType,
                otherPaymentType,
                amount: amount,
            },
        };

        return this.http.put<PayrollDriverMileageResponse>(
            `${environment.API_ENDPOINT}/api/payroll/owner/close`,
            body
        );
    }

    // FLAT RATE DRIVER
    public getFlatRatePayrollDriverList(): Observable<IDriverFlatRateList> {
        return this.http.get<IDriverFlatRateList>(
            `${environment.API_ENDPOINT}/api/payroll/driver/flatrate/list`
        );
    }

    public getPayrollFlatRateDriverClosedReportById(payrollId: number) {
        return this.http.get<PayrollDriverFlatRateClosedByIdResponse>(
            `${environment.API_ENDPOINT}/api/payroll/driver/flatrate/closed/${payrollId}`
        );
    }

    public getPayrollFlatRateDriverExpandedList(
        driverId: number
    ): Observable<PayrollDriverMileageExpandedListResponse[]> {
        return this.http.get<PayrollDriverMileageExpandedListResponse[]>(
            `${environment.API_ENDPOINT}/api/payroll/driver/flatrate/closed/expanded/list?Driverid=${driverId}`
        );
    }

    public getPayrollFlatRateDriverCollapsedList(): Observable<
        PayrollDriverMileageListResponse[]
    > {
        return this.http.get<PayrollDriverMileageCollapsedListResponse[]>(
            `${environment.API_ENDPOINT}/api/payroll/driver/flatrate/closed/collapsed/list`
        );
    }

    public getPayrollFlatRateDriverReport({
        reportId,
        selectedCreditIds,
        selectedDeductionIds,
        selectedLoadIds,
        selectedBonusIds,
    }: IGet_Payroll_Commission_Driver_Report): Observable<PayrollDriverFlatRateByIdResponse> {
        let params = new HttpParams();

        if (selectedLoadIds?.length)
            selectedLoadIds.map(
                (creditId) =>
                    (params = params.append('SelectedLoadIds', creditId))
            );
        else if (typeof selectedLoadIds != 'undefined')
            params = params.append(
                'SelectedLoadIds',
                selectedLoadIds.toString()
            );

        if (selectedCreditIds?.length)
            selectedCreditIds.map(
                (creditId) =>
                    (params = params.append('SelectedCreditIds', creditId))
            );
        else if (typeof selectedCreditIds != 'undefined')
            params = params.append(
                'SelectedCreditIds',
                selectedCreditIds.toString()
            );

        if (selectedDeductionIds?.length)
            selectedDeductionIds.map(
                (deductionId) =>
                    (params = params.append(
                        'SelectedDeductionIds',
                        deductionId
                    ))
            );
        else if (typeof selectedDeductionIds != 'undefined')
            params = params.append(
                'SelectedDeductionIds',
                selectedDeductionIds.toString()
            );

        return this.http.get<PayrollDriverFlatRateByIdResponse>(
            `${environment.API_ENDPOINT}/api/payroll/driver/flatrate/${reportId}`,
            { params }
        );
    }

    public closePayrollFlatRateDriverReport(
        amount: number,
        reportId: number,
        selectedLoadIds?: number[],
        selectedBonusIds?: number[],
        selectedDeducionIds?: number[],
        selectedCreditIds?: number[],
        paymentType?: PayrollPaymentType,
        otherPaymentType?: PayrollOtherPaymentType
    ): Observable<PayrollDriverMileageResponse> {
        const body: ClosePayrollDriverFlatRateCommand = {
            id: reportId,
            pay: {
                type: paymentType,
                otherPaymentType,
                //date: '2024-10-15T16:09:54.299Z',
                amount: amount,
            },
        };

        //if (selectedDeducionIds?.length)
        body.selectedDeducionIds = selectedDeducionIds;

        //if (selectedLoadIds?.length)
        body.selectedLoadIds = selectedLoadIds;

        // if (selectedCreditIds?.length)
        body.selectedCreditIds = selectedCreditIds;

        //if (selectedBonusIds?.length)
        body.selectedBonusIds = selectedBonusIds;

        return this.http.put<PayrollDriverMileageResponse>(
            `${environment.API_ENDPOINT}/api/payroll/driver/flatrate/close`,
            body
        );
    }

    public raiseDeleteModal(
        modalType:
            | TableStringEnum.DEDUCTION
            | TableStringEnum.CREDIT
            | TableStringEnum.BONUS
            | TableStringEnum.FUEL_1,
        action:
            | ConfirmationModalStringEnum.DELETE_DEDUCTION
            | ConfirmationModalStringEnum.DELETE_CREDIT
            | ConfirmationModalStringEnum.DELETE_FUEL
            | ConfirmationModalStringEnum.DELETE_BONUS,
        id: number,
        data: PayrollDeleteModal
    ) {
        return this.showDeductionModal(modalType, action, id, data);
    }

    public showDeductionModal(
        template: string,
        modalHeaderTitle: string,
        id: number,
        extras: PayrollDeleteModal
    ): Promise<any> {
        return this.modalService.openModal(
            ConfirmationModalComponent,
            { size: TableStringEnum.DELETE },
            {
                id,
                template,
                type: TableStringEnum.DELETE,
                svg: true,
                modalHeaderTitle,
                extras,
            }
        );
    }
}
