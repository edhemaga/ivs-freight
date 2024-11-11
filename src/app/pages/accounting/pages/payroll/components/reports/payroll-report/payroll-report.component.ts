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
import { PayrollFacadeService } from '../../../state/services/payroll.service';

// models
import {
    IGetPayrollByIdAndOptions,
    IPayrollProccessPaymentModal,
    MilesStopShortReponseWithRowType,
} from '../../../state/models/payroll.model';
import {
    MilesStopShortResponse,
    PayrollCreditType,
    PayrollDriverMileageByIdResponse,
} from 'appcoretruckassist';
import { ICaMapProps, ColumnConfig } from 'ca-components';
// components
import { PayrollProccessPaymentModalComponent } from '../../../payroll-modals/payroll-proccess-payment-modal/payroll-proccess-payment-modal.component';
import { PayrollReportBaseComponent } from '../payroll-report.base';

@Component({
    selector: 'app-payroll-report',
    templateUrl: './payroll-report.component.html',
    styleUrls: ['./payroll-report.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollReportComponent
    extends PayrollReportBaseComponent<PayrollDriverMileageByIdResponse>
    implements OnInit, OnDestroy
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

    data: any = {
        markers: [],
        routingMarkers: [],
    };

    public payAmount: UntypedFormControl = new UntypedFormControl();

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService,
        modalService: ModalService
    ) {
        super(modalService);
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

    subscribeToStoreData() {
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
                this.getReportDataResults({
                    reportId: `${this.reportId}`,
                    lastLoadDate: load.date,
                });
            }
        }
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

    public getReportDataResults(getData?: IGetPayrollByIdAndOptions) {
        this.payrollFacadeService.getPayrollDriverMileageReport(
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
