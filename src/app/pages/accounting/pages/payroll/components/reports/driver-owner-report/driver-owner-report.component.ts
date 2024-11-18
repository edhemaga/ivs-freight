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
import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';

//Services
import { ModalService } from '@shared/services/modal.service';
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services';
import { PayrollDriverOwnerFacadeService } from '@pages/accounting/pages/payroll/state/services';
import { PayrollService } from '@pages/accounting/pages/payroll/services/payroll.service';

// Models
import {
    LoadWithMilesStopResponse,
    PayrollCreditType,
    PayrollDriverMileageByIdResponse,
    PayrollOwnerResponse,
} from 'appcoretruckassist';
import { ColumnConfig } from 'ca-components';
import {
    IGetPayrollByIdAndOptions,
    IPayrollProccessPaymentModal,
} from '@pages/accounting/pages/payroll/state/models';

import { OwnerLoadShortReponseWithRowType } from '@pages/accounting/pages/payroll/state/models';

// Components
import { PayrollProccessPaymentModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-proccess-payment-modal/payroll-proccess-payment-modal.component';

// Enums
import { PayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { DriverMVrModalStringEnum } from '@pages/driver/pages/driver-modals/driver-mvr-modal/enums/driver-mvrl-modal-string.enum';

// Classes
import { PayrollReportBaseComponent } from '@pages/accounting/pages/payroll/components/reports/payroll-report.base';

@Component({
    selector: 'app-driver-owner-report',
    templateUrl: './driver-owner-report.component.html',
    styleUrls: [
        '../../../../payroll/payroll.component.scss',
        './driver-owner-report.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverOwnerReportComponent
    extends PayrollReportBaseComponent<PayrollOwnerResponse>
    implements OnInit, OnDestroy, AfterViewInit
{
    @Input() set reportId(report_id: string) {
        this._reportId = report_id;
        this.getReportDataResults();
    }

    get reportId(): string {
        return super.reportId; // Call the base class getter
    }

    public columns: ColumnConfig[];
    public creditType = PayrollCreditType.Truck;
    @Input() selectedTab: PayrollTablesStatus;
    public showMap: boolean = false;

    public loading$: Observable<boolean>;
    public includedLoads$: Observable<LoadWithMilesStopResponse[]>;

    private destroy$ = new Subject<void>();

    public payrollOpenedReport: PayrollOwnerResponse;

    public payrollReport$: Observable<PayrollOwnerResponse>;

    public payrollOwnerDriverLoads$: Observable<
        OwnerLoadShortReponseWithRowType[]
    >;
    public openedPayroll: PayrollOwnerResponse;

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
        private payrollDriverOwnerFacadeService: PayrollDriverOwnerFacadeService,
        private payrollFacadeService: PayrollFacadeService,
        modalService: ModalService,
        payrollService: PayrollService
    ) {
        super(modalService, payrollService);
    } 

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    private subscribeToStoreData(): void {
        this.loading$ = this.payrollFacadeService.payrollReportLoading$;
        this.payrollReport$ =
            this.payrollDriverOwnerFacadeService.selectPayrollOwnerOpenedReport$;

        this.payrollDriverOwnerFacadeService.selectPayrollOwnerOpenedReport$
            .pipe(takeUntil(this.destroy$))
            .subscribe((report) => (this.openedPayroll = report));

        this.payrollOwnerDriverLoads$ =
            this.payrollDriverOwnerFacadeService.selectPayrollReportDriverCommissionLoads$;

        this.includedLoads$ =
            this.payrollDriverOwnerFacadeService.selectPayrollReportOwnerIncludedLoads$;

        this.payrollDriverOwnerFacadeService.selectPayrollOwnerOpenedReport$
            .pipe(takeUntil(this.destroy$))
            .subscribe((owner) => {
                this.payrollOpenedReport = owner;
            });
    }

    ngAfterViewInit(): void {
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
                field: 'deliveries',
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

    public customSortPredicate = (
        index: number,
        data: CdkDrag<any>
    ): boolean => {
        return data.dropContainer.data[index - 1];
    };

    public onProccessPayroll(
        payrollData: PayrollDriverMileageByIdResponse
    ): void {
        this.modalService.openModal(
            PayrollProccessPaymentModalComponent,
            {
                size: DriverMVrModalStringEnum.SMALL,
            },
            {
                type: TableStringEnum.NEW,
                data: {
                    id: payrollData.id,
                    totalEarnings:
                        (payrollData as any).debt ?? payrollData.earnings,
                    payrollNumber: payrollData.payrollNumber,
                    selectedTab: this.selectedTab,
                    payrollType: 'owner',
                } as IPayrollProccessPaymentModal,
            }
        );
    }

    public onReorderDone(drag: CdkDragDrop<any[] | null, any, any>): void {
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

    public getReportDataResults(getData?: IGetPayrollByIdAndOptions): void {
        this.payrollDriverOwnerFacadeService.getPayrollDriverOwnerReport(
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
