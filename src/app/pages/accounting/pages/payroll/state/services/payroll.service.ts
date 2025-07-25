import { Injectable } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import { Store, select } from '@ngrx/store';

// Actions
import * as PayrollActions from '@pages/accounting/pages/payroll/state/actions';
import * as PayrollDriverMileageSolo from '@pages/accounting/pages/payroll/state/actions';
import * as PayrollCommissionActions from '@pages/accounting/pages/payroll/state/actions';
import * as PayrollOwnerActions from '@pages/accounting/pages/payroll/state/actions';
import * as PayrollFlatRateActions from '@pages/accounting/pages/payroll/state/actions';

// SELECTORS
import {
    selectClosingReportStatus,
    selectDriverMileageCollapsedTable,
    selectDriverMileageExpandedTable,
    selectPayrollCounts,
    selectPayrollDriverMileageStops,
    selectPayrollLoad,
    selectPayrollLoadListForDropdown,
    selectPayrollOpenedReport,
    selectPayrollOpenedTab,
    selectPayrollReportLoading,
    selectPayrollReportMapData,
    selectPayrollReportsIncludedStops,
    selectPayrollReportTableExpanded,
    selectPayrollState,
    selectSoloDriverMileage,
    seletPayrollTabsCount,
} from '@pages/accounting/pages/payroll/state/selectors';

// MODELS
import {
    MilesStopShortResponse,
    PayrollDriverMileageListResponse,
    PayrollMapLocation,
    PayrollOtherPaymentType,
    PayrollPaymentType,
} from 'appcoretruckassist';
import {
    IAddPayrollClosedPayment,
    IGetPayrollByIdAndOptions,
    IPayrollCountsSelector,
    MilesStopShortReponseWithRowType,
    PayrollDriverMileageExpandedListResponse,
    PayrollTypes,
} from '@pages/accounting/pages/payroll/state/models';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';

// Enums
import { ePayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';
import { ICaMapProps } from 'ca-components';

@Injectable({
    providedIn: 'root',
})
export class PayrollFacadeService {
    private payrollModalFormSubmited: Subject<boolean> = new Subject<null>();
    public payrollModalFormSubmited$: Observable<boolean> =
        this.payrollModalFormSubmited.asObservable();

    constructor(private store: Store) {}

    public resetForm(): void {
        this.payrollModalFormSubmited.next(true);
    }

    // SELECTORS

    // Select Payroll Counts
    public selectPayrollCounts$: Observable<IPayrollCountsSelector> =
        this.store.pipe(select(selectPayrollCounts));

    public payrollLoading$: Observable<boolean> = this.store.pipe(
        select(selectPayrollLoad)
    );

    public reportTableExpanded$: Observable<boolean> = this.store.pipe(
        select(selectPayrollReportTableExpanded)
    );

    public payrollReportLoading$: Observable<boolean> = this.store.pipe(
        select(selectPayrollReportLoading)
    );

    public getPayrollReportMapData$: Observable<ICaMapProps> = this.store.pipe(
        select(selectPayrollReportMapData)
    );

    public selectPayrollReportStates$: Observable<{
        loading: boolean;
        error: boolean;
    }> = this.store.pipe(select(selectClosingReportStatus));

    public selectPayrollOpenedReport$: Observable<PayrollDriverMileageResponse> =
        this.store.pipe(select(selectPayrollOpenedReport));

    public selectPayrollReportDriverMileageLoads$: Observable<
        MilesStopShortReponseWithRowType[]
    > = this.store.pipe(select(selectPayrollDriverMileageStops));

    public selectPayrollReportIncludedLoads$: Observable<
        MilesStopShortResponse[]
    > = this.store.pipe(select(selectPayrollReportsIncludedStops));

    public selectPayrollTabCounts$: Observable<{
        open: number;
        closed: number;
    }> = this.store.pipe(select(seletPayrollTabsCount));

    public selectPayrollOpenedTab$: Observable<ePayrollTablesStatus> =
        this.store.pipe(select(selectPayrollOpenedTab));

    // Select Driver Mileage Solo
    public selectPayrollDriverSoloMileage$: Observable<
        PayrollDriverMileageListResponse[]
    > = this.store.pipe(select(selectSoloDriverMileage));

    public selectPayrollDriverMileageCollapsed$: Observable<
        PayrollDriverMileageListResponse[]
    > = this.store.pipe(select(selectDriverMileageCollapsedTable));

    public selectPayrollDriverMileageExpanded$: Observable<
        PayrollDriverMileageExpandedListResponse[]
    > = this.store.pipe(select(selectDriverMileageExpandedTable));

    public selectPayrollDropdownLoadList$: Observable<
        {
            id: number;
            title: string;
        }[]
    > = this.store.pipe(select(selectPayrollLoadListForDropdown));

    public getPayrollCounts(showLoading: boolean): void {
        this.store
            .pipe(select(selectPayrollState), take(1))
            .subscribe((payrollState) => {
                this.store.dispatch(
                    PayrollActions.getPayrollCounts({
                        ShowOpen:
                            payrollState.payrollOpenedTab ===
                            ePayrollTablesStatus.OPEN,
                        showLoading,
                    })
                );
            });
    }

    public setPayrollOpenedTab(tabStatus: ePayrollTablesStatus): void {
        this.store.dispatch(PayrollActions.setPayrollopenedTab({ tabStatus }));
    }

    public getPayrollDriverMileageSoloList(): void {
        this.store.dispatch(
            PayrollDriverMileageSolo.getPayrollSoloMileageDriver()
        );
    }

    public getPayrollDriverMileageCollapsedList(): void {
        this.store.dispatch(
            PayrollDriverMileageSolo.getPayrollMileageDriverCollapsedList()
        );
    }

    public getPayrollDriverMileageExpandedList(driverId: number): void {
        this.store.dispatch(
            PayrollDriverMileageSolo.getPayrollMileageDriverExpandedList({
                driverId,
            })
        );
    }

    public setPayrollReportTableExpanded(
        expanded: boolean,
        openedPayrollLeftId: string
    ): void {
        this.store.dispatch(
            PayrollActions.setTableReportExpanded({
                expanded,
                openedPayrollLeftId,
            })
        );
    }

    public getPayrollDriverMileageClosedPayroll({
        reportId,
    }: {
        reportId: string;
    }): void {
        this.store.dispatch(
            PayrollDriverMileageSolo.getPayrollMileageDriverClosedPayroll({
                payrollId: +reportId,
            })
        );
    }

    public getPayrollDriverMileageReport({
        reportId,
        lastLoadDate,
        selectedCreditIds,
        selectedBonusIds,
        selectedDeductionIds,
        payrollOpenedTab,
    }: IGetPayrollByIdAndOptions) {
        this.store
            .pipe(select(selectPayrollState), take(1))
            .subscribe((payrollState) => {
                if (payrollOpenedTab === 'closed') {
                    this.store.dispatch(
                        PayrollDriverMileageSolo.getPayrollMileageDriverClosedPayroll(
                            {
                                payrollId: +reportId,
                            }
                        )
                    );
                } else {
                    this.store.dispatch(
                        PayrollDriverMileageSolo.getPayrollSoloMileageReportDriver(
                            {
                                reportId,
                                lastLoadDate:
                                    lastLoadDate ?? payrollState.lastLoadDate,
                                selectedCreditIds:
                                    selectedCreditIds ??
                                    payrollState.selectedCreditIds,
                                selectedBonusIds:
                                    selectedBonusIds ??
                                    payrollState.selectedBonusIds,
                                selectedDeductionIds:
                                    selectedDeductionIds ??
                                    payrollState.selectedDeductionIds,
                            }
                        )
                    );
                }
            });
    }

    public addPayrollClosedPayment(
        body: IAddPayrollClosedPayment,
        payrollType?: PayrollTypes
    ): void {
        if (payrollType === 'miles') {
            body.payrollDriverMileageId = body.modalId;
        } else if (payrollType == 'commission') {
            body.payrollDriverCommissionId = body.modalId;
        } else if (payrollType == 'flat rate') {
            body.payrollDriverFlatRateId = body.modalId;
        } else if (payrollType == 'owner') {
            body.payrollOwnerId = body.modalId;
        }

        this.store.dispatch(
            PayrollDriverMileageSolo.driverMileagePayrollClosedPayments(body)
        );
    }

    public closePayrollReport({
        reportId,
        amount,
        paymentType,
        otherPaymentType,
        payrollType,
    }: {
        reportId: number;
        amount: number;
        paymentType: PayrollPaymentType;
        otherPaymentType?: PayrollOtherPaymentType;
        payrollType?: PayrollTypes;
    }): void {
        this.store
            .pipe(select(selectPayrollState), take(1))
            .subscribe((payrollState) => {
                if (payrollType === 'miles') {
                    this.store.dispatch(
                        PayrollDriverMileageSolo.closePayrollSoloMileageReportDriver(
                            {
                                amount,
                                reportId,
                                lastLoadDate: payrollState.lastLoadDate,
                                selectedCreditIds:
                                    payrollState.selectedCreditIds,
                                selectedBonusIds: payrollState.selectedBonusIds,
                                selectedDeductionIds:
                                    payrollState.selectedDeductionIds,
                                paymentType,
                                otherPaymentType,
                            }
                        )
                    );
                } else if (payrollType === 'commission') {
                    this.store.dispatch(
                        PayrollCommissionActions.closePayrollCommissionReportDriver(
                            {
                                amount,
                                reportId,
                                selectedLoadIds: payrollState.selectedLoadIds,
                                selectedCreditIds:
                                    payrollState.selectedCreditIds,
                                selectedDeductionIds:
                                    payrollState.selectedDeductionIds,
                                paymentType,
                                otherPaymentType,
                            }
                        )
                    );
                } else if (payrollType === 'owner') {
                    this.store.dispatch(
                        PayrollOwnerActions.closePayrollOwnerReportDriver({
                            amount,
                            reportId,
                            selectedLoadIds: payrollState.selectedLoadIds,
                            selectedCreditIds: payrollState.selectedCreditIds,
                            selectedDeductionIds:
                                payrollState.selectedDeductionIds,
                            paymentType,
                            otherPaymentType,
                        })
                    );
                } else if (payrollType === 'flat rate') {
                    this.store.dispatch(
                        PayrollFlatRateActions.closePayrollFlatRateReportDriver(
                            {
                                amount,
                                reportId,
                                selectedLoadIds: payrollState.selectedLoadIds,
                                selectedCreditIds:
                                    payrollState.selectedCreditIds,
                                selectedDeductionIds:
                                    payrollState.selectedDeductionIds,
                                paymentType,
                                otherPaymentType,
                            }
                        )
                    );
                }
            });
    }
    public setPayrollMapData(payrollMapLocations: PayrollMapLocation[]): void {
        if (!payrollMapLocations) return;
        const mapLocations = JSON.stringify(
            payrollMapLocations.map(({ longitude, latitude }) => ({
                longitude,
                latitude,
            }))
        );

        this.store.dispatch(
            PayrollActions.getPayrollMapData({
                locations: mapLocations,
            })
        );
    }
}
