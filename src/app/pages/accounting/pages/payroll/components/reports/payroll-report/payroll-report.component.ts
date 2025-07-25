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
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';
import { DriverService } from '@pages/driver/services/driver.service';

// models
import {
    IDropdownMenuLoadItem,
    IGetPayrollByIdAndOptions,
    IPayrollProccessPaymentModal,
    MilesStopShortReponseWithRowType,
    IPayrollDriverMileageByIdResponseNumberId,
    PayrollTypes,
} from '@pages/accounting/pages/payroll/state/models';
import { MilesStopShortResponse, PayrollCreditType } from 'appcoretruckassist';
import { ColumnConfig, ICaMapProps, PayrollTypeEnum } from 'ca-components';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

// components
import { PayrollProccessPaymentModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-proccess-payment-modal/payroll-proccess-payment-modal.component';

// Enums
import { ePayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';
import { DriverMVrModalStringEnum } from '@pages/driver/pages/driver-modals/driver-mvr-modal/enums/driver-mvrl-modal-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ePayrollTable } from '@pages/accounting/pages/payroll/state/enums/payroll-table.enums';

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
    extends PayrollReportBaseComponent<IPayrollDriverMileageByIdResponseNumberId>
    implements OnInit, OnDestroy
{
    public columns: ColumnConfig[];
    public creditType = PayrollCreditType.Driver;
    public payrollType = PayrollTypeEnum.MILEAGE;

    public ePayrollTable = ePayrollTable;

    public dropdownMenuOptions: IDropdownMenuItem[] = [];
    public loadDropdownList: IDropdownMenuLoadItem[];

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

    public payrollReport$: Observable<IPayrollDriverMileageByIdResponseNumberId>;
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

    @ViewChild('towingTemplate', { static: false })
    public readonly towingTemplate!: ElementRef;

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
        payrollService: PayrollService,
        public loadStoreService: LoadStoreService,
        public driverService: DriverService
    ) {
        super(modalService, payrollService, loadStoreService, driverService);
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
                cellCustomClasses: 'relative',
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
                row: true,
                field: 'leg',
                cellType: 'template',
                template: this.towingTemplate,
                cellCustomClasses: 'text-right',
            },
            {
                header: 'EMPTY',
                row: true,
                field: 'empty',
                cellType: 'template',
                template: this.towingTemplate,
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
                row: true,
                field: 'miles',
                cellType: 'template',
                template: this.towingTemplate,
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
                row: true,
                field: 'subtotal',
                cellType: 'template', // Pass the template reference
                pipeType: 'currency',
                pipeString: 'USD',
                cellCustomClasses: 'text-right',
                textCustomClasses: 'b-600',
                template: this.towingTemplate,
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

        this.payrollFacadeService.selectPayrollDropdownLoadList$.subscribe(
            (loadList) => {
                this.loadDropdownList = loadList;
                //console.log('WHAT IS LOAD LIST HERE', loadList); // CONSOLE LOG FOR TESTING
            }
        );

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
            ].find((load) => load.id == loadId);
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
