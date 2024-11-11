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
import { Observable, Subject, takeUntil } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

// Components
import { ColumnConfig } from 'ca-components';

// Services
import { ModalService } from '@shared/services/modal.service';
import { PayrollDriverCommissionFacadeService } from '../../../state/services/payroll_driver_commision.service';
import { PayrollFacadeService } from '../../../state/services/payroll.service';

// Models
import {
    LoadWithMilesStopResponse,
    PayrollCreditType,
    PayrollDriverCommissionByIdResponse,
    PayrollDriverMileageByIdResponse,
} from 'appcoretruckassist';

import {
    MilesStopShortReponseWithRowType,
    IPayrollProccessPaymentModal,
    IGetPayrollByIdAndOptions,
} from '../../../state/models/payroll.model';
import { CommissionLoadShortReponseWithRowType } from '../../../state/models/driver_commission.model';
import { PayrollProccessPaymentModalComponent } from '../../../payroll-modals/payroll-proccess-payment-modal/payroll-proccess-payment-modal.component';
import { PayrollReportBaseComponent } from '../payroll-report.base';

@Component({
    selector: 'app-driver-commission-report',
    templateUrl: './driver-commission-report.component.html',
    styleUrls: ['./driver-commission-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverCommissionReportComponent
    extends PayrollReportBaseComponent<PayrollDriverCommissionByIdResponse>
    implements OnInit, OnDestroy, AfterViewInit
{
    columns: ColumnConfig[];
    creditType = PayrollCreditType.Driver;

    @Input() set reportId(report_id: string) {
        this._reportId = report_id;
        this.getReportDataResults();
    }

    get reportId(): string {
        return super.reportId; // Call the base class getter
    }

    @Input() selectedTab: 'open' | 'closed';
    showMap: boolean = false;

    public loading$: Observable<boolean>;

    private destroy$ = new Subject<void>();

    payrollReport$: Observable<PayrollDriverCommissionByIdResponse>;
    payrollReportList: MilesStopShortReponseWithRowType[] = [];
    payrollCommissionDriverLoads$: Observable<
        CommissionLoadShortReponseWithRowType[]
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
        private payrollCommissionFacadeService: PayrollDriverCommissionFacadeService,
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
                header: 'Revenue',
                field: 'revenue',
                pipeType: 'currency',
                pipeString: 'USD',
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

    openedPayroll: PayrollDriverCommissionByIdResponse;

    subscribeToStoreData() {
        this.loading$ = this.payrollFacadeService.payrollReportLoading$;
        this.payrollReport$ =
            this.payrollCommissionFacadeService.selectPayrollOpenedReport$;

        this.payrollFacadeService.selectPayrollOpenedReport$
            .pipe(takeUntil(this.destroy$))
            .subscribe((payroll) => {
                this.openedPayroll = payroll;
            });

        this.payrollCommissionDriverLoads$ =
            this.payrollCommissionFacadeService.selectPayrollReportDriverCommissionLoads$;

        this.includedLoads$ =
            this.payrollCommissionFacadeService.selectPayrollReportIncludedLoads$;

        this.payrollCommissionFacadeService.selectPayrollReportDriverCommissionLoads$.subscribe(
            (res) => console.log(res, '-fsfasdfsaf')
        );
    }

    onProccessPayroll(payrollData: PayrollDriverMileageByIdResponse) {
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
                    payrollType: 'commission',
                } as IPayrollProccessPaymentModal,
            }
        );
    }

    customSortPredicate = (index: number, _: CdkDragDrop<any>): boolean => {
        return true;
    };

    onReorderDone(drag: CdkDragDrop<any[] | null, any, any>) {
        const loadId = drag.container.data[drag.currentIndex - 1]?.id;
        if (loadId) {
            const loadList = [
                ...this.openedPayroll.includedLoads,
                ...this.openedPayroll.excludedLoads,
            ]
                .filter((load) => load.id <= loadId)
                .map((load) => load.id);

            if (loadList) {
                this.getReportDataResults({
                    reportId: `${this.reportId}`,
                    selectedLoadIds: loadList,
                });
            }
        }
    }

    public getReportDataResults(getData?: IGetPayrollByIdAndOptions) {
        this.payrollCommissionFacadeService.getPayrollDriverCommissionReport(
            getData ?? {
                reportId: `${this.reportId}`,
            }
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
