import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ColumnConfig } from 'ca-components';
import { Observable, Subject, takeUntil } from 'rxjs';
import { PayrollFacadeService } from '../../../state/services/payroll.service';
import { ModalService } from '@shared/services/modal.service';
import { PayrollDriverFlatRateFacadeService } from '../../../state/services/payroll_flat_rate.service';
import {
    IPayrollProccessPaymentModal,
    MilesStopShortReponseWithRowType,
} from '../../../state/models/payroll.model';
import {
    LoadWithMilesStopResponse,
    PayrollCreditType,
    PayrollDriverFlatRateByIdResponse,
} from 'appcoretruckassist';
import { FlatRateLoadShortReponseWithRowType } from '../../../state/models/driver_flat_rate.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { PayrollReportTableResponse } from 'ca-components/lib/components/ca-period-content/models/payroll-report-tables.type';
import { PayrollProccessPaymentModalComponent } from '../../../payroll-modals/payroll-proccess-payment-modal/payroll-proccess-payment-modal.component';
import { PayrollReportBaseComponent } from '../payroll-report.base';

@Component({
    selector: 'app-driver-flat-rate-report',
    templateUrl: './driver-flat-rate-report.component.html',
    styleUrls: ['./driver-flat-rate-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverFlatRateReportComponent
extends PayrollReportBaseComponent<PayrollDriverFlatRateByIdResponse>
    implements OnInit, OnDestroy, AfterViewInit
{
    columns: ColumnConfig[];
    creditType = PayrollCreditType.Driver;

    _reportId: string;
    @Input() set reportId(report_id: string) {
        this._reportId = report_id;
        this.payrollDriverFlatRateFacadeService.getPayrollDriverFlatRateReport({
            reportId: this.reportId,
        });
    }

    get reportId() {
        return this._reportId;
    }

    @Input() selectedTab: 'open' | 'closed';
    showMap: boolean = false;

    public loading$: Observable<boolean>;

    private destroy$ = new Subject<void>();

    openedPayroll: PayrollDriverFlatRateByIdResponse;

    payrollReport$: Observable<PayrollDriverFlatRateByIdResponse>;
    payrollReportList: MilesStopShortReponseWithRowType[] = [];
    payrollFlatRateDriverLoads$: Observable<
        FlatRateLoadShortReponseWithRowType[]
    >;

    includedLoads$: Observable<LoadWithMilesStopResponse[]>;

    // Templates
    @ViewChild('customCountTemplate', { static: false })
    public readonly customCountTemplate!: ElementRef;

    @ViewChild('customInvBrk', { static: false })
    public readonly customInvBrk!: ElementRef;

    @ViewChild('customLocationTypeLoad', { static: false })
    public readonly customLocationTypeLoad!: ElementRef;

    @ViewChild('customPickupHeaderTemplate', { static: false })
    public readonly customPickupHeaderTemplate!: ElementRef;

    @ViewChild('customDeliveryHeaderTemplate', { static: false })
    public readonly customDeliveryHeaderTemplate!: ElementRef;

    @ViewChild('cusstomLoadDescriptionTemplate', { static: false })
    public readonly cusstomLoadDescriptionTemplate!: ElementRef;

    constructor(
        // Services
        private payrollDriverFlatRateFacadeService: PayrollDriverFlatRateFacadeService,
        private payrollFacadeService: PayrollFacadeService,
        modalService: ModalService
    ) {
        super(modalService);
    }

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    ngAfterViewInit() {
        this.columns = [
            {
                header: '#',
                field: '',
                sortable: true,
                cellType: 'template',
                cellCustomClasses: 'text-center',
                template: this.customCountTemplate, // Pass the template reference
            },
            {
                header: 'INV, BROKER',
                row: true,
                sortable: false,
                cellType: 'template',
                template: this.customInvBrk, // Pass the template reference
            },
            {
                header: 'Pickup',
                headerCellType: 'template',
                headerTemplate: this.customPickupHeaderTemplate,
                field: 'pickups',
                cellType: 'template',
                template: this.cusstomLoadDescriptionTemplate, // Pass the template reference
            },
            {
                header: 'Delivery',
                headerCellType: 'template',
                headerTemplate: this.customDeliveryHeaderTemplate,
                field: 'pickups',
                cellType: 'template',
                template: this.cusstomLoadDescriptionTemplate, // Pass the template reference
            },
            {
                header: 'Empty',
                field: 'emptyMiles',
                cellType: 'text',
                cellCustomClasses: 'text-right',
            },
            {
                header: 'Loaded',
                field: 'loadedMiles',
                cellCustomClasses: 'text-right',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Miles',
                field: 'totalMiles',
                cellCustomClasses: 'text-right',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Subtotal',
                field: 'subtotal',
                pipeType: 'currency',
                pipeString: 'USD',
                cellType: 'text',
                cellCustomClasses: 'text-right',
                textCustomClasses: 'b-600',
            },
        ];
    }

    subscribeToStoreData() {
        this.loading$ = this.payrollFacadeService.payrollReportLoading$;
        this.payrollReport$ =
            this.payrollDriverFlatRateFacadeService.selectPayrollOpenedReport$;

        this.payrollDriverFlatRateFacadeService.selectPayrollOpenedReport$
            .pipe(takeUntil(this.destroy$))
            .subscribe((report) => (this.openedPayroll = report));

        this.includedLoads$ =
            this.payrollDriverFlatRateFacadeService.selectPayrollReportIncludedLoads$;

        this.payrollFlatRateDriverLoads$ =
            this.payrollDriverFlatRateFacadeService.selectPayrollReportDriverFlatRateLoads$;
    }

    customSortPredicate = (index: number, _: CdkDragDrop<any>): boolean => {
        return true;
    };

    onReorderItem({
        _included,
        _title,
    }: {
        _included: PayrollReportTableResponse[];
        _title: string;
    }) {
        // let dataSend = {
        //     reportId: `${this.reportId}`,
        //     selectedCreditIds: null,
        //     selectedDeducionIds: null,
        //     selectedBonusIds: null,
        // };
        // if (_title === 'Credit') {
        //     dataSend = {
        //         ...dataSend,
        //         selectedCreditIds: _included.map((load) => load.id),
        //     };
        // } else if (_title === 'Deduction') {
        //     dataSend = {
        //         ...dataSend,
        //         selectedDeducionIds: _included.map((load) => load.id),
        //     };
        // } else if (_title === 'Bonus') {
        //     dataSend = {
        //         ...dataSend,
        //         selectedBonusIds: _included.map((load) => load.id),
        //     };
        // }
        // this.payrollFacadeService.getPayrollDriverMileageReport(dataSend);
    }

    onProccessPayroll(payrollData: PayrollDriverFlatRateByIdResponse) {
        this.modalService.openModal(
            PayrollProccessPaymentModalComponent,
            {
                size: 'small',
            },
            {
                type: 'new',
                data: {
                    id: payrollData.id,
                    totalEarnings:
                        (payrollData as any).debt ?? payrollData.earnings,
                    payrollNumber: payrollData.payrollNumber,
                    selectedTab: this.selectedTab,
                    payrollType: 'flat rate',
                } as IPayrollProccessPaymentModal,
            }
        );
    }

    public getReportDataResults() {
        this.payrollDriverFlatRateFacadeService.getPayrollDriverFlatRateReport({
            reportId: this.reportId,
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
