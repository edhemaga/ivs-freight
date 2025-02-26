import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Observable, takeUntil, Subject } from 'rxjs';

// services
import { ModalService } from '@shared/services/modal.service';
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services';
import { PayrollService } from '@pages/accounting/pages/payroll/services';

// models
import {
    IGetPayrollByIdAndOptions,
    IPayrollProccessPaymentModal,
    MilesStopShortReponseWithRowType,
    PayrollTypes,
} from '@pages/accounting/pages/payroll/state/models';
import {
    MilesStopShortResponse,
    PayrollCreditType,
    PayrollDriverMileageByIdResponse,
} from 'appcoretruckassist';
import { ColumnConfig, ICaMapProps, PayrollTypeEnum } from 'ca-components';
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';

// components
import { PayrollProccessPaymentModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-proccess-payment-modal/payroll-proccess-payment-modal.component';

// Enums
import { ePayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';
import { DriverMVrModalStringEnum } from '@pages/driver/pages/driver-modals/driver-mvr-modal/enums/driver-mvrl-modal-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Classes
import { PayrollReportBaseComponent } from '@pages/accounting/pages/payroll/components/reports/payroll-report.base';

// helpers
import { PayrollReportHelper } from '@pages/accounting/pages/payroll/components/reports/payroll-report/utils/helpers';

@Component({
    selector: 'app-payroll-report',
    templateUrl: './payroll-report.component.html',
    styleUrls: [
        '../../../../payroll/payroll.component.scss',
        './payroll-report.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollReportComponent
    extends PayrollReportBaseComponent<PayrollDriverMileageByIdResponse>
    implements OnInit, OnDestroy
{
    public columns: ColumnConfig[];
    public creditType = PayrollCreditType.Driver;
    public payrollType = PayrollTypeEnum.MILEAGE;

    public dropdownMenuOptions: DropdownMenuItem[] = [];

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

    public payrollReport$: Observable<PayrollDriverMileageByIdResponse>;
    public payrollMileageDriverLoads$: Observable<
        MilesStopShortReponseWithRowType[]
    >;
    public includedLoads$: Observable<MilesStopShortResponse[]>;
    public loading$: Observable<boolean>;
    public payrollReportList: MilesStopShortReponseWithRowType[] = [];
    public allowedLoadIds: number[];
    public showMap: boolean = false;

    public mapData$: Observable<ICaMapProps>;

    @ViewChild('customCountTemplate', { static: false })
    public readonly customCountTemplate!: ElementRef;
    @ViewChild('customLocationTypeLoad', { static: false })
    public readonly customLocationTypeLoad!: ElementRef;

    @ViewChild('customFeeTemplate', { static: false })
    public readonly customFeeTemplate!: ElementRef;

    public reportMainData: any = {
        loads: [],
        truck: {},
        owner: {},
        driver: {},
    };
    public tableSettings: any[] = [];
    public tableSettingsResizable: any[] = [];
    public title: string = '';
    private destroy$ = new Subject<void>();

    public data: any = {
        markers: [],
        routingMarkers: [],
    };

    public payAmount: UntypedFormControl = new UntypedFormControl();

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService,
        modalService: ModalService,
        payrollService: PayrollService
    ) {
        super(modalService, payrollService);
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
                header: 'LOCATION, TYPE',
                row: true,
                cellType: 'template',
                template: this.customLocationTypeLoad, // Pass the template reference
            },
            {
                header: 'DATE',
                field: 'date',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'TIME',
                field: 'time',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'LEG',
                field: 'leg',
                cellType: 'text', // Pass the template reference
                cellCustomClasses: 'text-right',
            },
            {
                header: 'EMPTY',
                field: 'empty',
                cellType: 'text', // Pass the template reference
                cellCustomClasses: 'text-right',
            },
            {
                header: 'LOADED',
                field: 'loaded',
                cellType: 'text', // Pass the template reference
                cellCustomClasses: 'text-right',
            },
            {
                header: 'MILES',
                field: 'miles',
                cellType: 'text', // Pass the template reference
                cellCustomClasses: 'text-right',
            },
            {
                header: '',
                field: 'extraStopFee',
                cellType: 'template', // Pass the template reference
                template: this.customFeeTemplate,
                cellCustomClasses: 'text-center',
            },
            {
                header: 'SUBTOTAL',
                field: 'subtotal',
                cellType: 'text',
                pipeType: 'currency',
                pipeString: 'USD',
                cellCustomClasses: 'text-right',
                textCustomClasses: 'b-600',
            },
        ];
    }

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    public customSortPredicate = (
        index: number,
        _: CdkDragDrop<any>
    ): boolean => {
        return this.allowedLoadIds.includes(index);
    };

    public subscribeToStoreData(): void {
        this.loading$ = this.payrollFacadeService.payrollReportLoading$;
        this.payrollReport$ =
            this.payrollFacadeService.selectPayrollOpenedReport$;

        this.payrollFacadeService.selectPayrollOpenedReport$
            .pipe(takeUntil(this.destroy$))
            .subscribe((payroll) => {
                this.openedPayroll = payroll;
            });

        this.payrollMileageDriverLoads$ =
            this.payrollFacadeService.selectPayrollReportDriverMileageLoads$;

        this.includedLoads$ =
            this.payrollFacadeService.selectPayrollReportIncludedLoads$;

        this.mapData$ = this.payrollFacadeService.getPayrollReportMapData$;

        this.payrollFacadeService.selectPayrollReportDriverMileageLoads$
            .pipe(takeUntil(this.destroy$))
            .subscribe((payrollLoadList) => {
                const filteredPayrollList = payrollLoadList.filter(
                    (load) => !(load as any).rowType
                );

                this.allowedLoadIds = filteredPayrollList
                    .map((loads, index) => {
                        const load = loads as MilesStopShortResponse;
                        const nextLoad = filteredPayrollList[
                            index + 1
                        ] as MilesStopShortResponse;

                        const prevLoad = filteredPayrollList[
                            index - 1
                        ] as MilesStopShortResponse;

                        const currentLoadId = load.loadId;
                        const nextLoadId = nextLoad?.loadId;

                        if (nextLoadId != currentLoadId && prevLoad)
                            return index + 1;

                        return null;
                    })
                    .filter((loadId) => loadId != null);

                this.payrollReportList = payrollLoadList;
            });
    }

    public onReorderDone(drag: CdkDragDrop<any[] | null, any, any>): void {
        const loadId = drag.container.data[drag.currentIndex - 1]?.loadId;
        if (loadId) {
            const load = [
                ...this.openedPayroll.includedLoads,
                ...this.openedPayroll.excludedLoads,
            ].find((load) => load.loadId == loadId);
            if (load) {
                this.getReportDataResults({
                    reportId: `${this.reportId}`,
                    lastLoadDate: load.date,
                    payrollOpenedTab: this.selectedTab,
                });
            }
        }
    }

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
                    payrollType: PayrollTypes.MILES,
                } as IPayrollProccessPaymentModal,
            }
        );
    }

    public getReportDataResults(getData?: IGetPayrollByIdAndOptions): void {
        this.payrollFacadeService.getPayrollDriverMileageReport(
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
        const loadDummyData = [
            // w8 for slavisa
            { id: 1, title: 'INV-162-23' },
            { id: 2, title: 'INV-162-26' },
            { id: 3, title: 'INV-162-28' },
            { id: 4, title: 'INV-162-31' },
            { id: 5, title: 'INV-162-33' },
        ];

        this.dropdownMenuOptions =
            PayrollReportHelper.getPayrollDropdownContent(
                false,
                this._selectedTab,
                this.isEditLoadDropdownActionActive,
                loadDummyData
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
