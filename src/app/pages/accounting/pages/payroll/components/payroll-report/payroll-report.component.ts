import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

// services
import { PayrollService } from '@pages/accounting/services/payroll.service';

// constants
import { PayrollCommisionDriverOpenLoads } from '@pages/accounting/pages/payroll/components/payroll-report/utils/constants/payroll-commision-driver-open-loads.constants';
import {
    PayrollOwnerOpenLoads,
    PayrollOwnerOpenLoadsResizable,
} from '@pages/accounting/pages/payroll/components/payroll-report/utils/constants/payroll-owner-open-load.constants';
import {
    PayrollMilesDriverOpenLoads,
    PayrollMilesDriverOpenLoadsResizable,
} from '@pages/accounting/pages/payroll/components/payroll-report/utils/constants/payroll-miles-driver-open-loads.constants';
import { PayrollFacadeService } from '../../state/services/payroll.service';
import { Observable } from 'rxjs';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';
import { MilesStopShortResponse } from 'appcoretruckassist';
import { ICaMapProps, ColumnConfig } from 'ca-components';

@Component({
    selector: 'app-payroll-report',
    templateUrl: './payroll-report.component.html',
    styleUrls: ['./payroll-report.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PayrollReportComponent implements OnInit {
    columns: ColumnConfig[];
    @Input() reportId: number;
    payrollReport$: Observable<PayrollDriverMileageResponse>;
    payrollMileageDriverLoads$: Observable<MilesStopShortResponse[]>;
    public loading$: Observable<boolean>;

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
        private payrollFacadeService: PayrollFacadeService
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

    subscribeToStoreData() {
        this.payrollFacadeService.getPayrollDriverMileageReport(
            `${this.reportId}`
        );
        this.loading$ = this.payrollFacadeService.payrollReportLoading$;
        this.payrollReport$ =
            this.payrollFacadeService.selectPayrollOpenedReport$;

        this.payrollFacadeService.selectPayrollOpenedReport$.subscribe(
            (payroll) => {
                console.log('PAYROLL MAIN INFO', payroll);
            }
        );

        this.payrollMileageDriverLoads$ =
            this.payrollFacadeService.selectPayrollReportDriverMileageLoads$;

        this.payrollFacadeService.selectPayrollReportDriverMileageLoads$.subscribe(
            (aa) => {
                console.log('LOAD INFO', aa);
            }
        );
        this.payrollFacadeService.selectPayrollReportDriverMileageLoads$.subscribe(
            (payroll) => {
                console.log('PAYROLLL', payroll);
            }
        );
    }

    getDataBasedOnTitle(data: { id: number; title: string }) {
        this.title = data.title;
        switch (data.title) {
            case 'Owner':
                this.tableSettings = PayrollOwnerOpenLoads;
                this.tableSettingsResizable = PayrollOwnerOpenLoadsResizable;
                // They changed back in service is same error it need to be checked further to resolve error
                // this.payrollService.getPayrollOwnerOpenReport(data.id).subscribe((res) => {
                //     this.reportMainData = res;
                //     this.dch.detectChanges();
                // });
                break;
            case 'Driver (Commission)':
                this.tableSettings = PayrollCommisionDriverOpenLoads;
                this.payrollService
                    .getPayrollCommisionDriverOpenReport(data.id)
                    .subscribe((res) => {
                        this.reportMainData = res;
                        this.dch.detectChanges();
                    });
                break;
            case 'Driver (Miles)':
                this.tableSettings = PayrollMilesDriverOpenLoads;
                this.tableSettingsResizable =
                    PayrollMilesDriverOpenLoadsResizable;
                this.payrollService.getPayrollMileageDriverOpenReport();
                // Same error as above
                // .subscribe((res) => {
                //     this.reportMainData = res;
                //     this.dch.detectChanges();
                // });
                break;
        }
    }
}
