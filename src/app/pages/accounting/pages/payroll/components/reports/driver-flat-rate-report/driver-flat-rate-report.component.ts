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

// Components
import { ColumnConfig, ICaMapProps, PayrollTypeEnum } from 'ca-components';

// Services
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services';
import { ModalService } from '@shared/services/modal.service';
import { PayrollDriverFlatRateFacadeService } from '@pages/accounting/pages/payroll/state/services';
import { PayrollService } from '@pages/accounting/pages/payroll/services/payroll.service';

// Models
import {
    IGetPayrollByIdAndOptions,
    IPayrollProccessPaymentModal,
    MilesStopShortReponseWithRowType,
    PayrollTypes,
} from '@pages/accounting/pages/payroll/state/models';
import {
    LoadWithMilesStopResponse,
    PayrollCreditType,
    PayrollDriverFlatRateByIdResponse,
} from 'appcoretruckassist';
import { FlatRateLoadShortReponseWithRowType } from '@pages/accounting/pages/payroll/state/models';
import { OptionsPopupContent } from 'ca-components/lib/components/ca-burger-menu/models/burger-menu.model';

// Components
import { PayrollProccessPaymentModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-proccess-payment-modal/payroll-proccess-payment-modal.component';

// Enums
import { PayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';
import { DriverMVrModalStringEnum } from '@pages/driver/pages/driver-modals/driver-mvr-modal/enums/driver-mvrl-modal-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Classes
import { PayrollReportBaseComponent } from '@pages/accounting/pages/payroll/components/reports/payroll-report.base';


// Constants
import { TableToolbarConstants } from '../constants/report.constants';

@Component({
    selector: 'app-driver-flat-rate-report',
    templateUrl: './driver-flat-rate-report.component.html',
    styleUrls: [
        '../../../../payroll/payroll.component.scss',
        './driver-flat-rate-report.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverFlatRateReportComponent
    extends PayrollReportBaseComponent<PayrollDriverFlatRateByIdResponse>
    implements OnInit, OnDestroy, AfterViewInit
{
    public columns: ColumnConfig[];
    public creditType = PayrollCreditType.Driver;
    public payrollType = PayrollTypeEnum.FLAT_RATE;

    public optionsPopupContent: OptionsPopupContent[] =
    TableToolbarConstants.closedReportPayroll;

    @Input() set reportId(report_id: string) {
        this._reportId = report_id;
        this.getReportDataResults();
    }

    get reportId(): string {
        return super.reportId; // Call the base class getter
    }

    public _selectedTab: PayrollTablesStatus;
    @Input() set selectedTab(tab: PayrollTablesStatus) {
        this.optionsPopupContent =
            tab === PayrollTablesStatus.OPEN
                ? TableToolbarConstants.openReportPayroll
                : TableToolbarConstants.closedReportPayroll;
        this._selectedTab = tab;
    }

    public get selectedTab() {
        return this._selectedTab;
    }

    public showMap: boolean = false;
    public mapData$: Observable<ICaMapProps>;

    public loading$: Observable<boolean>;

    private destroy$ = new Subject<void>();

    public openedPayroll: PayrollDriverFlatRateByIdResponse;

    public payrollReport$: Observable<PayrollDriverFlatRateByIdResponse>;
    public payrollReportList: MilesStopShortReponseWithRowType[] = [];
    public payrollFlatRateDriverLoads$: Observable<
        FlatRateLoadShortReponseWithRowType[]
    >;

    public includedLoads$: Observable<LoadWithMilesStopResponse[]>;

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
        modalService: ModalService,
        payrollService: PayrollService
    ) {
        super(modalService, payrollService);
    }

    ngOnInit(): void {
        this.subscribeToStoreData();
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

    private subscribeToStoreData(): void {
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

        this.mapData$ = this.payrollFacadeService.getPayrollReportMapData$;
    }

    public customSortPredicate = (
        index: number,
        data: CdkDrag<any>
    ): boolean => {
        return data.dropContainer.data[index - 1];
    };

    public onProccessPayroll(
        payrollData: PayrollDriverFlatRateByIdResponse
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
                    payrollType: PayrollTypes.FLAT_RATE,
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
                    payrollOpenedTab: this.selectedTab
                });
            }
        }
    }

    public getReportDataResults(getData?: IGetPayrollByIdAndOptions): void {
        this.payrollDriverFlatRateFacadeService.getPayrollDriverFlatRateReport(
            getData
                ? {
                      ...getData,
                      payrollOpenedTab: this.selectedTab,
                  }
                : {
                      reportId: `${this.reportId}`,
                      payrollOpenedTab: this.selectedTab,
                  }
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
