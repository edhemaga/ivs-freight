import { Injectable } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as PayrollActions from '../actions/payroll.actions';
import * as PayrollDriverMileageSolo from '../actions/payroll_solo_mileage_driver.actions';
import * as PayrollCommissionActions from '../actions/payroll_commission_driver.actions';
import * as PayrollOwnerActions from '../actions/payroll_owner_driver.action';
import * as PayrollFlatRateActions from '../actions/payroll_flat_rate_driver.actions';

// SELECTORS
import {
    selectClosingReportStatus,
    selectDriverMileageCollapsedTable,
    selectDriverMileageExpandedTable,
    selectPayrollCounts,
    selectPayrollDriverMileageStops,
    selectPayrollLoad,
    selectPayrollOpenedReport,
    selectPayrollOpenedTab,
    selectPayrollReportLoading,
    selectPayrollReportsIncludedStops,
    selectPayrollReportTableExpanded,
    selectPayrollState,
    selectSoloDriverMileage,
    seletPayrollTabsCount,
} from '../selectors/payroll.selector';

// MODELS
import {
    MilesStopShortResponse,
    PayrollDriverMileageListResponse,
    PayrollOtherPaymentType,
    PayrollPaymentType,
} from 'appcoretruckassist';
import {
    IAddPayrollClosedPayment,
    IPayrollCountsSelector,
    MilesStopShortReponseWithRowType,
    PayrollDriverMileageExpandedListResponse,
    PayrollTypes,
} from '../models/payroll.model';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';

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

    public selectPayrollOpenedTab$: Observable<'open' | 'closed'> =
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

    public getPayrollCounts() {
        this.store
            .pipe(select(selectPayrollState), take(1))
            .subscribe((payrollState) => {
                this.store.dispatch(
                    PayrollActions.getPayrollCounts({
                        ShowOpen: payrollState.payrollOpenedTab === 'open',
                    })
                );
            });
    }

    public setPayrollOpenedTab(tabStatus: 'open' | 'closed') {
        this.store.dispatch(PayrollActions.setPayrollopenedTab({ tabStatus }));
    }

    public getPayrollDriverMileageSoloList() {
        this.store.dispatch(
            PayrollDriverMileageSolo.getPayrollSoloMileageDriver()
        );
    }

    public getPayrollDriverMileageCollapsedList() {
        this.store.dispatch(
            PayrollDriverMileageSolo.getPayrollMileageDriverCollapsedList()
        );
    }

    public getPayrollDriverMileageExpandedList(driverId: number) {
        this.store.dispatch(
            PayrollDriverMileageSolo.getPayrollMileageDriverExpandedList({
                driverId,
            })
        );
    }

    public setPayrollReportTableExpanded(expanded: boolean) {
        this.store.dispatch(
            PayrollActions.setTableReportExpanded({ expanded })
        );
    }

    public getPayrollDriverMileageClosedPayroll({
        reportId,
    }: {
        reportId: string;
    }) {
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
        selectedDeducionIds,
    }: {
        reportId: string;
        lastLoadDate?: string;
        selectedCreditIds?: number[];
        selectedBonusIds?: number[];
        selectedDeducionIds?: number[];
    }) {
        this.store
            .pipe(select(selectPayrollState), take(1))
            .subscribe((payrollState) => {
                if (payrollState.payrollOpenedTab === 'closed') {
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
                                    selectedDeducionIds ??
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
    ) {
        if (payrollType === 'miles') {
            body.payrollDriverMileageId = body.modalId;
        } else if (payrollType == 'commission') {
            body.payrollDriverCommissionId = body.modalId;
        } else if (payrollType == 'flat rate') {
            //body.payro
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
    }) {
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
}
