import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
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

// Components
import { PayrollProccessPaymentModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-proccess-payment-modal/payroll-proccess-payment-modal.component';
import { ColumnConfig, ICaMapProps, PayrollTypeEnum } from 'ca-components';

// Services
import { PayrollService } from '@pages/accounting/pages/payroll/services';
import {
    PayrollDriverCommissionFacadeService,
    PayrollFacadeService,
} from '@pages/accounting/pages/payroll/state/services';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';
import { ModalService } from '@shared/services/modal.service';
import { DriverService } from '@pages/driver/services/driver.service';

// Models
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import {
    IDropdownMenuLoadItem,
    IGetPayrollByIdAndOptions,
    ILoadWithMilesStopResponseNumberId,
    IPayrollProccessPaymentModal,
    MilesStopShortReponseWithRowType,
    IPayrollDriverMileageByIdResponseNumberId,
    PayrollTypes,
} from '@pages/accounting/pages/payroll/state/models';
import {
    PayrollCreditType,
    PayrollDriverCommissionByIdResponse,
} from 'appcoretruckassist';

import { CommissionLoadShortReponseWithRowType } from '@pages/accounting/pages/payroll/state/models';

// Classes
import { PayrollReportBaseComponent } from '@pages/accounting/pages/payroll/components/reports/payroll-report.base';

import { ePayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';
import { DriverMVrModalStringEnum } from '@pages/driver/pages/driver-modals/driver-mvr-modal/enums/driver-mvrl-modal-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

// helpers
import { PayrollReportHelper } from '@pages/accounting/pages/payroll/components/reports/payroll-report/utils/helpers';

@Component({
    selector: 'app-driver-commission-report',
    templateUrl: './driver-commission-report.component.html',
    styleUrls: [
        '../../../../payroll/payroll.component.scss',
        './driver-commission-report.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverCommissionReportComponent
    extends PayrollReportBaseComponent<PayrollDriverCommissionByIdResponse>
    implements OnInit, OnDestroy, AfterViewInit
{
    public columns: ColumnConfig[];
    public creditType = PayrollCreditType.Driver;
    public payrollType = PayrollTypeEnum.COMMISSION;

    public loadDropdownList: IDropdownMenuLoadItem[];

    public dropdownMenuOptions: IDropdownMenuItem[] = [];

    @Input() set reportId(report_id: string) {
        this._reportId = report_id;
        this.getReportDataResults();
    }

    get reportId(): string {
        return super.reportId; // Call the base class getter
    }

    public _selectedTab: ePayrollTablesStatus;
    @Input() set selectedTab(tab: ePayrollTablesStatus) {
        this._selectedTab = tab;

        this.dropdownMenuOptions =
            PayrollReportHelper.getPayrollDropdownContent(
                false,
                this._selectedTab,
                this.isEditLoadDropdownActionActive
            );
    }

    public get selectedTab() {
        return this._selectedTab;
    }

    public showMap: boolean = false;
    public mapData$: Observable<ICaMapProps>;

    public loading$: Observable<boolean>;

    private destroy$ = new Subject<void>();

    public openedPayroll: PayrollDriverCommissionByIdResponse;
    public payrollReport$: Observable<PayrollDriverCommissionByIdResponse>;
    public payrollReportList: MilesStopShortReponseWithRowType[] = [];
    public payrollCommissionDriverLoads$: Observable<
        CommissionLoadShortReponseWithRowType[]
    >;

    public includedLoads$: Observable<ILoadWithMilesStopResponseNumberId[]>;

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
        modalService: ModalService,
        payrollService: PayrollService,
        public loadStoreService: LoadStoreService,
        public driverService: DriverService
    ) {
        super(modalService, payrollService, loadStoreService, driverService);
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

    private subscribeToStoreData(): void {
        this.loading$ = this.payrollFacadeService.payrollReportLoading$;
        this.payrollReport$ =
            this.payrollCommissionFacadeService.selectPayrollOpenedReport$;

        this.payrollFacadeService.selectPayrollOpenedReport$
            .pipe(takeUntil(this.destroy$))
            .subscribe((payroll) => {
                this.openedPayroll = payroll;
            });

        this.payrollFacadeService.selectPayrollDropdownLoadList$.subscribe(
            (loadList) => {
                this.loadDropdownList = loadList;
                //console.log('WHAT IS LOAD LIST HERE', loadList); // CONSOLE LOG FOR TESTING
            }
        );

        this.payrollCommissionDriverLoads$ =
            this.payrollCommissionFacadeService.selectPayrollReportDriverCommissionLoads$;

        this.payrollCommissionFacadeService.selectPayrollReportDriverCommissionLoads$.subscribe(
            (res) => {
                //console.log("SUBSS", res); // CONSOLE LOG FOR DEVELOPMENT
            }
        );

        this.includedLoads$ =
            this.payrollCommissionFacadeService.selectPayrollReportIncludedLoads$;

        this.mapData$ = this.payrollFacadeService.getPayrollReportMapData$;
    }

    public onProccessPayroll(
        payrollData: IPayrollDriverMileageByIdResponseNumberId
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
                    payrollType: PayrollTypes.COMMISSION,
                } as IPayrollProccessPaymentModal,
            }
        );
    }

    public customSortPredicate = (
        index: number,
        data: CdkDrag<any>
    ): boolean => {
        return data.dropContainer.data[index - 1];
    };

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
                    payrollOpenedTab: this.selectedTab,
                });
            }
        }
    }

    public getReportDataResults(getData?: IGetPayrollByIdAndOptions) {
        this.payrollCommissionFacadeService.getPayrollDriverCommissionReport(
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

    public getIsEditLoadDropdownActionActive(): void {
        this.dropdownMenuOptions =
            PayrollReportHelper.getPayrollDropdownContent(
                false,
                this._selectedTab,
                this.isEditLoadDropdownActionActive,
                this.loadDropdownList
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
