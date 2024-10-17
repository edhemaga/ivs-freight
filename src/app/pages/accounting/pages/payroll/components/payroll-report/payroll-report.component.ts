import {
    ChangeDetectorRef,
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
import { PayrollService } from '@pages/accounting/services/payroll.service';

// models
import { MilesStopShortReponseWithRowType } from '../../state/models/payroll.model';
import {
    MilesStopShortResponse,
    PayrollDriverMileageByIdResponse,
} from 'appcoretruckassist';

// constants
import { PayrollFacadeService } from '../../state/services/payroll.service';

import { ICaMapProps, ColumnConfig } from 'ca-components';
import { PayrollReportTableResponse } from 'ca-components/lib/components/ca-period-content/models/payroll-report-tables.type';

import { ModalService } from '@shared/services/modal.service';
import { PayrollProccessPaymentModalComponent } from '../../payroll-modals/payroll-proccess-payment-modal/payroll-proccess-payment-modal.component';

@Component({
    selector: 'app-payroll-report',
    templateUrl: './payroll-report.component.html',
    styleUrls: ['./payroll-report.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PayrollReportComponent implements OnInit, OnDestroy {
    columns: ColumnConfig[];
    @Input() reportId: number;
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
    @ViewChild('reorderTemplate', { static: false })
    public readonly reorderTemplate!: ElementRef;

    @ViewChild('reorderTemplatePreview', { static: false })
    public readonly reorderTemplatePreview!: ElementRef;

    @ViewChild('customFeeTemplate', { static: false })
    public readonly customFeeTemplate!: ElementRef;

    reportMainData: any = { loads: [], truck: {}, owner: {}, driver: {} };
    tableSettings: any[] = [];
    tableSettingsResizable: any[] = [];
    title: string = '';
    private destroy$ = new Subject<void>();

    data: ICaMapProps = {
        center: {
            lat: 41.860119,
            lng: -87.660156,
        },
        mapZoom: 1,
        markers: [],
        clustermarkers: [],
        routingMarkers: [],
        mapOptions: {
            fullscreenControl: false,
            disableDefaultUI: true,
            restriction: {
                latLngBounds: {
                    north: 75,
                    south: 9,
                    west: -170,
                    east: -50,
                },
                strictBounds: true,
            },
            streetViewControl: false,
            styles: [
                {
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#f5f5f5',
                        },
                    ],
                },
                {
                    elementType: 'labels.icon',
                    stylers: [
                        {
                            visibility: 'on',
                        },
                    ],
                },
                {
                    featureType: 'administrative.land_parcel',
                    elementType: 'labels',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'labels.text',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'labels.text',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'transit',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'administrative.country',
                    stylers: [
                        {
                            color: '#616161',
                        },
                        {
                            visibility: 'on',
                        },
                        {
                            weight: 1,
                        },
                    ],
                },
                {
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#616161',
                        },
                    ],
                },
                {
                    elementType: 'labels.text.stroke',
                    stylers: [
                        {
                            color: '#f5f5f5',
                        },
                    ],
                },
                {
                    featureType: 'administrative.land_parcel',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#bdbdbd',
                        },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#eeeeee',
                        },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#757575',
                        },
                    ],
                },
                {
                    featureType: 'poi.park',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#e5e5e5',
                        },
                    ],
                },
                {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#9e9e9e',
                        },
                    ],
                },
                {
                    featureType: 'landscape',
                    elementType: 'labels',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#ffffff',
                        },
                    ],
                },
                {
                    featureType: 'road',
                    stylers: [
                        {
                            saturation: -100,
                        },
                        {
                            lightness: 30,
                        },
                    ],
                },
                {
                    featureType: 'road.arterial',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#757575',
                        },
                    ],
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#dadada',
                        },
                    ],
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#616161',
                        },
                    ],
                },
                {
                    featureType: 'road.local',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#9e9e9e',
                        },
                    ],
                },
                {
                    featureType: 'transit.line',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#e5e5e5',
                        },
                    ],
                },
                {
                    featureType: 'transit.station',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#eeeeee',
                        },
                    ],
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#c9c9c9',
                        },
                    ],
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#9e9e9e',
                        },
                    ],
                },
            ],
            keyboardShortcuts: false,
            panControl: true,
            gestureHandling: 'greedy',
        },
    };

    public payAmount: UntypedFormControl = new UntypedFormControl();

    // @Input() set reportTableData(value) {
    //     if (value.id) {
    //         this.getDataBasedOnTitle(value);
    //     }
    // }

    constructor(
        // Services
        private payrollService: PayrollService,

        // Ref
        private dch: ChangeDetectorRef,
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
            // {
            //     header: 'Status',
            //     field: 'payrollDeadLine',
            //     cellType: 'template',
            //     template: this.customStatusTemplate, // Pass the template reference
            // },
            // {
            //     header: 'Empty',
            //     field: 'emptyMiles',
            //     headerCellType: 'template',
            //     headerTemplate: this.customMileageHeaderTemplate,
            //     cellType: 'template',
            //     template: this.customTextTemplate, // Pass the template reference
            //     hiddeOnTableReduce: true,
            // },
            // {
            //     header: 'Loaded',
            //     headerCellType: 'template',
            //     headerTemplate: this.customMileageHeaderTemplate,
            //     field: 'loadedMiles',
            //     cellType: 'template',
            //     template: this.customTextTemplate, // Pass the template reference
            //     hiddeOnTableReduce: true,
            // },
            // {
            //     header: 'Total',
            //     field: 'totalMiles',
            //     headerCellType: 'template',
            //     headerTemplate: this.customMileageHeaderTemplate,
            //     cellType: 'template',
            //     template: this.customTextTemplate, // Pass the template reference
            //     hiddeOnTableReduce: true,
            // },
            // {
            //     header: 'Salary',
            //     field: 'salary',
            //     pipeType: 'currency',
            //     pipeString: 'USD',
            //     cellCustomClasses: 'text-center',
            //     cellType: 'text', // Pass the template reference
            //     hiddeOnTableReduce: true,
            // },
            // {
            //     header: 'Total',
            //     field: 'total',
            //     pipeType: 'currency',
            //     pipeString: 'USD',
            //     cellType: 'text',
            //     cellCustomClasses: 'text-right',
            //     textCustomClasses: 'b-600',
            // },
        ];
    }

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    customSortPredicate = (index: number, item: CdkDragDrop<any>): boolean => {
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

                       if (nextLoadId != currentLoadId) {
                            return index + 1;
                        }

                        return null;
                    })
                    .filter((loadId) => loadId != null);

                this.payrollReportList = payrollLoadList;
            });
    }

    onReorderDone(drag: CdkDragDrop<any[] | null, any, any>) {
        console.log(drag.currentIndex);
        console.log(drag.previousIndex);
        console.log('ON DRAG FINISH', drag.container.data);

        const loadId = drag.container.data[drag.currentIndex - 1]?.loadId;
        console.log('WHAT IS LOAD ID', loadId);
        console.log([
            ...this.openedPayroll.includedLoads,
            ...this.openedPayroll.excludedLoads,
        ]);
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
            selectedDeducionIds: null,
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
                selectedDeducionIds: _included.map((load) => load.id),
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
        console.log('open payroll', payrollData);

        this.modalService.openModal(
            PayrollProccessPaymentModalComponent,
            {
                size: 'small',
            },
            {
                type: 'new', // 'edit' stavljas ako treba kad se azurira postojeci
                data: payrollData, // da ne bi morao da pozivam kod sebe get by id, samo javi kad zavrsis
            }
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
