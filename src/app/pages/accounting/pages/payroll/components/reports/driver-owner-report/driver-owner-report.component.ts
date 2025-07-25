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
import {
    PayrollFacadeService,
    PayrollDriverOwnerFacadeService,
} from '@pages/accounting/pages/payroll/state/services';
import { PayrollService } from '@pages/accounting/pages/payroll/services';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';
import { DriverService } from '@pages/driver/services/driver.service';

// Models
import { PayrollCreditType, PayrollOwnerResponse } from 'appcoretruckassist';
import { ColumnConfig, ICaMapProps, PayrollTypeEnum } from 'ca-components';
import {
    IDropdownMenuLoadItem,
    IGetPayrollByIdAndOptions,
    ILoadWithMilesStopResponseNumberId,
    IPayrollProccessPaymentModal,
    IPayrollDriverMileageByIdResponseNumberId,
} from '@pages/accounting/pages/payroll/state/models';

import { OwnerLoadShortReponseWithRowType } from '@pages/accounting/pages/payroll/state/models';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

import { PayrollProccessPaymentModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-proccess-payment-modal/payroll-proccess-payment-modal.component';
import { PayrollPdfReportComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-report/payroll-pdf-report.component';

// Enums
import { ePayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { DriverMVrModalStringEnum } from '@pages/driver/pages/driver-modals/driver-mvr-modal/enums/driver-mvrl-modal-string.enum';

// Classes
import { PayrollReportBaseComponent } from '@pages/accounting/pages/payroll/components/reports/payroll-report.base';

// helpers
import { PayrollReportHelper } from '@pages/accounting/pages/payroll/components/reports/payroll-report/utils/helpers';

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
    public payrollType = PayrollTypeEnum.OWNER_COMMISSION;

    public loadDropdownList: IDropdownMenuLoadItem[];

    public dropdownMenuOptions: IDropdownMenuItem[] = [];

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
    public includedLoads$: Observable<ILoadWithMilesStopResponseNumberId[]>;

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
        payrollService: PayrollService,
        public loadStoreService: LoadStoreService,
        public driverService: DriverService
    ) {
        super(modalService, payrollService, loadStoreService, driverService);
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

        this.payrollFacadeService.selectPayrollDropdownLoadList$.subscribe(
            (loadList) => {
                this.loadDropdownList = loadList;
                //console.log('WHAT IS LOAD LIST HERE', loadList); // CONSOLE LOG FOR TESTING
            }
        );

        this.mapData$ = this.payrollFacadeService.getPayrollReportMapData$;
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
        payrollData: IPayrollDriverMileageByIdResponseNumberId
    ): void {
        const totalEarnings = (payrollData as any).debt ?? payrollData.earnings;
        this.modalService.openModal(
            PayrollProccessPaymentModalComponent,
            {
                size: DriverMVrModalStringEnum.SMALL,
            },
            {
                type: TableStringEnum.NEW,
                data: {
                    id: payrollData.id,
                    totalEarnings: totalEarnings > 0 ? totalEarnings : 0,
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
                    payrollOpenedTab: this.selectedTab,
                });
            }
        }
    }

    public getReportDataResults(getData?: IGetPayrollByIdAndOptions): void {
        this.payrollDriverOwnerFacadeService.getPayrollDriverOwnerReport(
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

    public openPreviewModal(): void {
        this.modalService.openModal(
            PayrollPdfReportComponent,
            {},
            {
                data: {
                    id: 210,
                    type: 'MILEAGE',
                },
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
