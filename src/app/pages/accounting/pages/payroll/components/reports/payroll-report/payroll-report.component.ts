import {
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
import { PayrollFacadeService } from '../../../state/services/payroll.service';

// models
import {
    IPayrollProccessPaymentModal,
    MilesStopShortReponseWithRowType,
} from '../../../state/models/payroll.model';
import {
    MilesStopShortResponse,
    PayrollDriverMileageByIdResponse,
} from 'appcoretruckassist';
import { ICaMapProps, ColumnConfig } from 'ca-components';
import { PayrollReportTableResponse } from 'ca-components/lib/components/ca-period-content/models/payroll-report-tables.type';

// components
import { PayrollProccessPaymentModalComponent } from '../../../payroll-modals/payroll-proccess-payment-modal/payroll-proccess-payment-modal.component';

@Component({
    selector: 'app-payroll-report',
    templateUrl: './payroll-report.component.html',
    styleUrls: ['./payroll-report.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PayrollReportComponent implements OnInit, OnDestroy {
    columns: ColumnConfig[];
    @Input() reportId: number;
    @Input() selectedTab: 'open' | 'closed';

    payrollReport$: Observable<PayrollDriverMileageByIdResponse>;
    payrollMileageDriverLoads$: Observable<MilesStopShortReponseWithRowType[]>;
    includedLoads$: Observable<MilesStopShortResponse[]>;
    public loading$: Observable<boolean>;
    payrollReportList: MilesStopShortReponseWithRowType[] = [];
    allowedLoadIds: number[];
    showMap: boolean = false;

    @ViewChild('customCountTemplate', { static: false })
    public readonly customCountTemplate!: ElementRef;
    @ViewChild('customLocationTypeLoad', { static: false })
    public readonly customLocationTypeLoad!: ElementRef;

    @ViewChild('customFeeTemplate', { static: false })
    public readonly customFeeTemplate!: ElementRef;

    reportMainData: any = { loads: [], truck: {}, owner: {}, driver: {} };
    tableSettings: any[] = [];
    tableSettingsResizable: any[] = [];
    title: string = '';
    private destroy$ = new Subject<void>();

    data: ICaMapProps = {
        markers: [],
        routingMarkers: [],
    };

    public payAmount: UntypedFormControl = new UntypedFormControl();

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService,
        private modalService: ModalService
    ) {}

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

    customSortPredicate = (index: number, _: CdkDragDrop<any>): boolean => {
        return this.allowedLoadIds.includes(index);
    };

    openedPayroll: PayrollDriverMileageByIdResponse;

    subscribeToStoreData() {
        this.payrollFacadeService.getPayrollDriverMileageReport({
            reportId: `${this.reportId}`,
        });
        this.loading$ = this.payrollFacadeService.payrollReportLoading$;
        this.payrollReport$ =
            this.payrollFacadeService.selectPayrollOpenedReport$;

        this.payrollFacadeService.selectPayrollOpenedReport$
            .pipe(takeUntil(this.destroy$))
            .subscribe((payroll) => {
                this.openedPayroll = payroll;
                console.log('PAYROLL MAIN INFO', payroll);
            });

        this.payrollMileageDriverLoads$ =
            this.payrollFacadeService.selectPayrollReportDriverMileageLoads$;

        this.includedLoads$ =
            this.payrollFacadeService.selectPayrollReportIncludedLoads$;

        this.payrollFacadeService.selectPayrollReportDriverMileageLoads$
            .pipe(takeUntil(this.destroy$))
            .subscribe((aa) => {
                console.log('LOAD INFO', aa);
            });
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

                        if (nextLoadId != currentLoadId && prevLoad) {
                            return index + 1;
                        }

                        return null;
                    })
                    .filter((loadId) => loadId != null);

                this.payrollReportList = payrollLoadList;
            });
    }

    onReorderDone(drag: CdkDragDrop<any[] | null, any, any>) {
        const loadId = drag.container.data[drag.currentIndex - 1]?.loadId;
        if (loadId) {
            const load = [
                ...this.openedPayroll.includedLoads,
                ...this.openedPayroll.excludedLoads,
            ].find((load) => load.loadId == loadId);
            if (load) {
                this.payrollFacadeService.getPayrollDriverMileageReport({
                    reportId: `${this.reportId}`,
                    lastLoadDate: load.date,
                });
            }
        }
    }

    onReorderItem({
        _included,
        _title,
    }: {
        _included: PayrollReportTableResponse[];
        _title: string;
    }) {
        let dataSend = {
            reportId: `${this.reportId}`,
            selectedCreditIds: null,
            selectedDeductionIds: null,
            selectedBonusIds: null,
        };
        if (_title === 'Credit') {
            dataSend = {
                ...dataSend,
                selectedCreditIds: _included.map((load) => load.id),
            };
        } else if (_title === 'Deduction') {
            dataSend = {
                ...dataSend,
                selectedDeductionIds: _included.map((load) => load.id),
            };
        } else if (_title === 'Bonus') {
            dataSend = {
                ...dataSend,
                selectedBonusIds: _included.map((load) => load.id),
            };
        }

        this.payrollFacadeService.getPayrollDriverMileageReport(dataSend);
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
                    payrollType: 'miles',
                } as IPayrollProccessPaymentModal,
            }
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
