import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// modules
import { SharedModule } from '@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// moment
import moment from 'moment';

// pipes
import { SumArraysPipe } from '@shared/pipes/sum-arrays.pipe';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { DriverPayTypesCardNamePipe } from '@pages/driver/pages/driver-details/components/driver-details-card/pipes/driver-pay-types-card-name.pipe';
import { DriverPayTypesCardSubtextPipe } from '@pages/driver/pages/driver-details/components/driver-details-card/pipes/driver-pay-types-card-subtext.pipe';
import { DriverPayTypesBoxTitlePipe } from '@pages/driver/pages/driver-details/components/driver-details-card/pipes/driver-pay-types-box-title.pipe';
import { DriverPayTypesBoxSecondTitlePipe } from '@pages/driver/pages/driver-details/components/driver-details-card/pipes/driver-pay-types-box-second-title.pipe';
import { DriverPayTypesBoxValuePipe } from '@pages/driver/pages/driver-details/components/driver-details-card/pipes/driver-pay-types-box-value.pipe';
import { DriverPayTypesBoxSecondValuePipe } from '@pages/driver/pages/driver-details/components/driver-details-card/pipes/driver-pay-types-box-second-value.pipe';

// animations
import { cardComponentAnimation } from '@shared/animations/card-component.animation';

// helpers
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';

// services
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DriverCdlService } from '@pages/driver/pages/driver-modals/driver-cdl-modal/services/driver-cdl.service';
import { DriverMedicalService } from '@pages/driver/pages/driver-modals/driver-medical-modal/services/driver-medical.service';
import { DriverMvrService } from '@pages/driver/pages/driver-modals/driver-mvr-modal/services/driver-mvr.service';
import { DriverDrugAlcoholTestService } from '@pages/driver/pages/driver-modals/driver-drug-alcohol-test-modal/services/driver-drug-alcohol-test.service';
import { DriverService } from '@pages/driver/services/driver.service';
import { DetailsPageService } from '@shared/services/details-page.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { ImageBase64Service } from '@shared/services/image-base64.service';

// components
import { DriverCdlModalComponent } from '@pages/driver/pages/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholTestModalComponent } from '@pages/driver/pages/driver-modals/driver-drug-alcohol-test-modal/driver-drug-alcohol-test-modal.component';
import { DriverMedicalModalComponent } from '@pages/driver/pages/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '@pages/driver/pages/driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { TaChartComponent } from '@shared/components/ta-chart/ta-chart.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaPasswordAccountHiddenCharactersComponent } from '@shared/components/ta-password-account-hidden-characters/ta-password-account-hidden-characters.component';

// constants
import { ChartConstants } from '@shared/components/ta-chart/utils/constants/chart.constants';
import { DriverDetailsCard } from '@pages/driver/pages/driver-details/components/driver-details-card/utils/constants/driver-details-card.constants';

// store
import { DriversMinimalListQuery } from '@pages/driver/state/driver-details-minimal-list-state/driver-minimal-list.query';

// enums
import { ArrowActionsStringEnum } from '@shared/enums/arrow-actions-string.enum';
import { DriverDetailsCardStringEnum } from '@pages/driver/pages/driver-details/components/driver-details-card/enums/driver-details-card-string.enum';
import { DriverImagesStringEnum } from '@pages/driver/pages/driver-details/components/driver-details-card/enums/driver-images-string.enum';
import { BrokerTabStringEnum } from '@pages/customer/pages/broker-details/enums/broker-tab-string.enum';

// models
import { DoughnutChartConfig } from '@pages/dashboard/models/dashboard-chart-models/doughnut-chart.model';
import { ChartApiCall } from '@shared/components/ta-chart/models/chart-api-call.model';
import { LegendAttributes } from '@shared/components/ta-chart/models/legend-attributes.model';
import { BarChartAxes } from '@pages/dashboard/models/dashboard-chart-models/bar-chart.model';
import {
    CdlResponse,
    DriverMinimalResponse,
    DriverPayrollResponse,
    DriverResponse,
    EmploymentHistoryResponse,
    MedicalResponse,
    MvrResponse,
    TestResponse,
} from 'appcoretruckassist';
import { TabOptions } from '@shared/components/ta-tab-switch/models/tab-options.model';
import { DriverDropdown } from '@pages/driver/pages/driver-details/components/driver-details-card/models/driver-dropdown.model';
import { DriverDateInfo } from '@pages/driver/models/driver-date-info.model';

@Component({
    selector: 'app-driver-details-card',
    templateUrl: './driver-details-card.component.html',
    styleUrls: ['./driver-details-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [cardComponentAnimation('showHideCardBody')],
    providers: [SumArraysPipe],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        NgbModule,
        SharedModule,
        ReactiveFormsModule,

        // components
        TaAppTooltipV2Component,
        TaTabSwitchComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaProfileImagesComponent,
        TaCopyComponent,
        TaCommonCardComponent,
        TaProgressExpirationComponent,
        TaCounterComponent,
        TaDetailsHeaderCardComponent,
        TaChartComponent,
        TaPasswordAccountHiddenCharactersComponent,

        // pipes
        FormatDatePipe,
        DriverPayTypesCardNamePipe,
        DriverPayTypesCardSubtextPipe,
        DriverPayTypesBoxTitlePipe,
        DriverPayTypesBoxSecondTitlePipe,
        DriverPayTypesBoxValuePipe,
        DriverPayTypesBoxSecondValuePipe,
    ],
})
export class DriverDetailsCardComponent
    implements OnInit, OnDestroy, OnChanges
{
    @ViewChild('payrollChart') public payrollChart: TaChartComponent;

    @Input() driver: DriverResponse;
    @Input() templateCard: boolean;

    //Form
    public note: UntypedFormControl = new UntypedFormControl();
    public cdlNote: UntypedFormControl = new UntypedFormControl();
    public testNote: UntypedFormControl = new UntypedFormControl();
    public medicalNote: UntypedFormControl = new UntypedFormControl();
    public mvrNote: UntypedFormControl = new UntypedFormControl();

    //Basic driver data
    public toggler: boolean[] = [];
    public dataTest: any; //leave this any
    public selectedTab: number;
    public yearsService: number = 0;
    public daysService: number = 0;
    public activePercentage: number = 0;
    public firstDate: string;
    public lastDate: string;
    public deactivatePeriod: boolean;
    public tooltipData: DriverDateInfo;
    public tooltipFormatStartDate: string;
    public tooltipFormatEndDate: string;
    public showTooltip: boolean;
    public tabsDriver: TabOptions[];
    public dropData: any; //leave this any
    public dataProggress: EmploymentHistoryResponse[];
    public hideArrow: boolean;
    public expDateCard: boolean;
    public templateName: boolean;
    public currentDriverIndex: number;

    // Driver Dropdown
    public driversDropdowns: DriverDropdown[];
    public driversList: DriverMinimalResponse[] =
        this.driverMinimalQuery.getAll();
    public dataCDl: CdlResponse;
    public dropActionName: string = '';
    public driverOwner: boolean;
    public cdlItemData: CdlResponse;
    public dataMvr: MvrResponse;
    public dataMedical: MedicalResponse;
    public dataTestCard: TestResponse;
    public driverObject: DriverResponse;
    public showMoreEmployment: boolean;

    //Chart
    public barChartConfig: DoughnutChartConfig =
        DriverDetailsCard.BAR_CHART_CONFIG;
    public barChartLegend: LegendAttributes[] =
        DriverDetailsCard.BAR_CHART_LEGEND;
    public barAxes: BarChartAxes = DriverDetailsCard.BAR_CHART_AXES;

    public payrollCall: ChartApiCall = {
        id: -1,
        chartType: 1,
    };
    private monthList: string[] = ChartConstants.MONTH_LIST_SHORT;

    private destroy$ = new Subject<void>();

    //////////////////

    public employmentHistoryData = [
        {
            percents: 25,
            isEmployed: true,
            isDeactivated: false,
            startDate: '10 September, 2021',
            endDate: '04 January, 2023',
            yearsOfService: 2,
            daysOfService: 103,
        },
        {
            percents: 25,
            isEmployed: false,
            isDeactivated: true,
            startDate: '10 September, 2021',
            endDate: '04 January, 2023',
            yearsOfService: 3,
            daysOfService: 103,
        },
        {
            percents: 25,
            isEmployed: true,
            isDeactivated: false,
            startDate: '10 September, 2021',
            endDate: '04 January, 2023',
            yearsOfService: 4,
            daysOfService: 103,
        },
        {
            percents: 25,
            isEmployed: false,
            isDeactivated: true,
            startDate: '10 September, 2021',
            endDate: '04 January, 2023',
            yearsOfService: 5,
            daysOfService: 103,
        },
    ];

    public progressBarHoverIndex = -1;

    public isPayTypesCardOpen: boolean = true;

    constructor(
        private cdRef: ChangeDetectorRef,

        // pipes
        private sumArr: SumArraysPipe,

        // services
        private modalService: ModalService,
        private detailsPageDriverSer: DetailsPageService,
        private tableService: TruckassistTableService,
        public imageBase64Service: ImageBase64Service,
        private cdlService: DriverCdlService,
        private medicalService: DriverMedicalService,
        private mvrService: DriverMvrService,
        private testService: DriverDrugAlcoholTestService,
        private driverService: DriverService,
        private confirmationService: ConfirmationService,
        private dropDownService: DropDownService,

        // store
        private driverMinimalQuery: DriversMinimalListQuery
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (
            !changes?.driver?.firstChange &&
            changes?.driver.currentValue &&
            changes?.driver.currentValue.id
        ) {
            if (changes?.driver?.currentValue?.note) {
                this.note.patchValue(changes?.driver?.currentValue?.note);
            } else {
                this.note.reset();
            }
            this.getExpireDate(changes?.driver?.currentValue);
            this.getYearsAndDays(changes?.driver?.currentValue);
            this.widthOfProgress();
            this.getDriverById(changes.driver.currentValue.id);
            this.getDriversDropdown();
            if (changes?.driver?.firstChange) {
                if (this.templateCard == true) {
                    this.hideArrow = true;
                } else {
                    this.hideArrow = false;
                }
            }
        }
        this.getDriverPayrollChartData(
            changes.driver.currentValue.id,
            this.payrollCall.chartType,
            false
        );
        this.driverMinimalQuery
            .selectAll()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.driversList = item));
    }

    ngOnInit(): void {
        console.log('driver', this.driver);
        this.getDriverById(this.driver.id);
        this.note.patchValue(this.driver.note);

        setTimeout(() => {
            const currentIndex = this.driversDropdowns.findIndex(
                (driver) => driver.id === this.driver.id
            );

            this.currentDriverIndex = currentIndex;
        }, 300);

        // Confirmation Subscribe
        if (this.templateCard) {
            this.confirmationService.confirmationData$
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res) => {
                        switch (res.type) {
                            case DriverDetailsCardStringEnum.DELETE_2:
                                if (
                                    res.template ===
                                    DriverDetailsCardStringEnum.CDL_2
                                )
                                    this.deleteCdlByIdFunction(res.id);
                                else if (
                                    res.template ===
                                    DriverDetailsCardStringEnum.MEDICAL_2
                                )
                                    this.deleteMedicalByIdFunction(res.id);
                                else if (
                                    res.template ===
                                    DriverDetailsCardStringEnum.MVR_2
                                )
                                    this.deleteMvrByIdFunction(res.id);
                                else if (
                                    res.template ===
                                    DriverDetailsCardStringEnum.TEST_2
                                )
                                    this.deleteTestByIdFunction(res.id);
                                break;
                            default: {
                                break;
                            }
                        }
                    },
                });
        }
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                //leave this any for someone working on confirmation modals
                if (res.animation) {
                    this.driver = res.data;
                    this.getExpireDate(res.data);
                    this.cdRef.detectChanges();
                }
            });
        if (this.templateCard == true) {
            this.hideArrow = true;
        } else {
            this.hideArrow = false;
        }
        this.initTableOptions();
        this.initTableOptionsCard(this.driver);
        this.getDriversDropdown();
        this.tabsButton();
        this.getYearsAndDays(this.driver);
        this.widthOfProgress();
        this.getExpireDate(this.driver);
    }
    public getNameForDrop(name: string) {
        switch (name) {
            case DriverDetailsCardStringEnum.CDL_2:
                this.templateName = false;
                this.initTableOptions();
                this.getExpireDate(this.driver);
                break;
            case DriverDetailsCardStringEnum.TEST_2:
                this.templateName = true;
                this.initTableOptions();
                break;
            case DriverDetailsCardStringEnum.MEDICAL_2:
                this.templateName = true;
                this.initTableOptions();
                break;
            case DriverDetailsCardStringEnum.MVR_2:
                this.templateName = true;
                this.initTableOptions();
                break;
        }
    }

    public tabsButton(): void {
        this.tabsDriver = [
            {
                id: 223,
                name: BrokerTabStringEnum.ONE_MONTH,
                checked: true,
            },
            {
                id: 313,
                name: BrokerTabStringEnum.THREE_MONTHS,
                checked: false,
            },
            {
                id: 412,
                name: BrokerTabStringEnum.SIX_MONTHS,
                checked: false,
            },
            {
                id: 515,
                name: BrokerTabStringEnum.ONE_YEAR,
                checked: false,
            },
            {
                id: 1210,
                name: BrokerTabStringEnum.YEAR_TO_DATE,
                checked: false,
            },
            {
                id: 1011,
                name: BrokerTabStringEnum.ALL,
                checked: false,
            },
        ];
    }

    public handlePayTypesCardOpen(isOpen: boolean): void {
        this.isPayTypesCardOpen = isOpen;
    }

    /**Function for toggle page in cards */
    public toggleResizePage(value: number, indexName: string): void {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }
    public changeTab(ev: TabOptions): void {
        this.selectedTab = ev.id;
        const chartType = this.payrollChart?.detailsTimePeriod(ev.name);
        this.getDriverPayrollChartData(this.driver.id, chartType);
    }
    public getDriverById(id: number): void {
        if (!id) return;

        this.driverService
            .getDriverById(id, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.driverObject = item));
    }
    public onDriverActions(event: Event): void {
        this.dropDownService.dropActionsHeader(
            event,
            this.driverObject,
            this.driver.id
        );
    }
    public optionsEvent(eventData: Event, action: string): void {
        const name = DropActionNameHelper.dropActionNameDriver(
            eventData,
            action
        );
        this.dropDownService.dropActions(
            eventData,
            name,
            this.dataCDl,
            this.dataMvr,
            this.dataMedical,
            this.dataTest,
            this.driver.id
        );
    }
    public getCdlById(id: number): void {
        this.cdlService
            .getCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.cdlItemData = item));
    }

    public getMedicalById(id: number): void {
        this.medicalService
            .getMedicalById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.dataMedical = item));
    }

    public getMvrById(id: number): void {
        this.mvrService
            .getMvrById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.dataMvr = item));
    }

    public getTestById(id: number): void {
        this.testService
            .getTestById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.dataTestCard = item));
    }
    public deleteCdlByIdFunction(id: number): void {
        this.cdlService
            .deleteCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }

    private deleteMedicalByIdFunction(id: number): void {
        this.medicalService
            .deleteMedicalById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }

    private deleteMvrByIdFunction(id: number): void {
        this.mvrService
            .deleteMvrById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }

    private deleteTestByIdFunction(id: number): void {
        this.testService
            .deleteTestById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }
    /**Function retrun id */
    public identity(index: number): number {
        return index;
    }

    /**Function for dots in cards */
    public initTableOptions(): void {
        this.dataTest = {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: DriverDetailsCardStringEnum.EDIT,
                    name: DriverDetailsCardStringEnum.EDIT_2,
                    svg: DriverImagesStringEnum.EDIT,
                    show: true,
                },
                {
                    title: DriverDetailsCardStringEnum.RENEW,
                    name: DriverDetailsCardStringEnum.RENEW_2,
                    svg: DriverImagesStringEnum.RENEW,
                    show: !this.templateName ? true : false,
                },
                {
                    title: DriverDetailsCardStringEnum.VOID,
                    name: DriverDetailsCardStringEnum.ACTIVATE_ITEM,
                    svg: DriverImagesStringEnum.CANCEL,
                    show: !this.templateName ? true : false,
                },
                {
                    title: DriverDetailsCardStringEnum.DELETE,
                    name: DriverDetailsCardStringEnum.DELETE_ITEM,
                    type: DriverDetailsCardStringEnum.DRIVER_2,
                    text: DriverDetailsCardStringEnum.DELETE_DRIVER_MESSAGE,
                    svg: DriverImagesStringEnum.DELETE,
                    danger: true,
                    show: true,
                },
            ],
            export: true,
        };
    }

    /**Function for dots in cards */
    public initTableOptionsCard(data: any): void {
        //leave this any
        this.dropData = {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: DriverDetailsCardStringEnum.SEND_MESSAGE,
                    name: DriverDetailsCardStringEnum.DM,
                    svg: DriverImagesStringEnum.DM,
                    show: data.status === 1 ? true : false,
                },
                {
                    title: DriverDetailsCardStringEnum.PRINT,
                    name: DriverDetailsCardStringEnum.PRINT_2,
                    svg: DriverImagesStringEnum.PRINT,
                    show: data.status === 1 || data.status === 0 ? true : false,
                },

                {
                    title: DriverDetailsCardStringEnum.EDIT,
                    name: DriverDetailsCardStringEnum.EDIT_2,
                    svg: DriverImagesStringEnum.EDIT,
                    show: data.status === 1 ? true : false,
                },
                {
                    title:
                        data.status === 0
                            ? DriverDetailsCardStringEnum.ACTIVATE
                            : DriverDetailsCardStringEnum.DEACTIVATE,
                    name: DriverDetailsCardStringEnum.DEACTIVATE_2,
                    svg: DriverImagesStringEnum.DEACTIVATE,
                    activate: data.status === 0 ? true : false,
                    deactivate: data.status === 1 ? true : false,
                    show: data.status === 1 || data.status === 0 ? true : false,
                },
                {
                    title: DriverDetailsCardStringEnum.DELETE,
                    name: DriverDetailsCardStringEnum.DELETE_ITEM,
                    type: DriverDetailsCardStringEnum.DRIVER_2,
                    text: DriverDetailsCardStringEnum.DELETE_DRIVER_MESSAGE,
                    svg: DriverImagesStringEnum.DELETE,
                    danger: true,
                    show: data.status === 1 || data.status === 0 ? true : false,
                },
            ],
            export: true,
        };
    }

    public getExpireDate(data: any): void {
        //leave this any for someone working on driver to fix it
        this.dataCDl = data?.cdls?.map((ele) => {
            if (moment(ele.expDate).isBefore(moment())) {
                this.expDateCard = false;
            } else {
                this.expDateCard = true;
            }
            return {
                ...ele,
                showButton: this.expDateCard,
            };
        });
    }

    public onModalAction(action: string): void {
        if (action.includes(DriverDetailsCardStringEnum.DRUG))
            action = DriverDetailsCardStringEnum.DRUG_ALCOHOL;
        switch (action) {
            case DriverDetailsCardStringEnum.CDL:
                this.modalService.openModal(
                    DriverCdlModalComponent,
                    { size: DriverDetailsCardStringEnum.SMALL },
                    {
                        id: this.driver.id,
                        type: DriverDetailsCardStringEnum.NEW_LICENCE,
                    }
                );
                break;
            case DriverDetailsCardStringEnum.DRUG_ALCOHOL:
                this.modalService.openModal(
                    DriverDrugAlcoholTestModalComponent,
                    { size: DriverDetailsCardStringEnum.SMALL },
                    {
                        id: this.driver.id,
                        type: DriverDetailsCardStringEnum.NEW_DRUG,
                    }
                );

                break;
            case DriverDetailsCardStringEnum.MEDICAL:
                this.modalService.openModal(
                    DriverMedicalModalComponent,
                    { size: DriverDetailsCardStringEnum.SMALL },
                    {
                        id: this.driver.id,
                        type: DriverDetailsCardStringEnum.NEW_MEDICAL,
                    }
                );
                break;
            case DriverDetailsCardStringEnum.MVR:
                this.modalService.openModal(
                    DriverMvrModalComponent,
                    { size: DriverDetailsCardStringEnum.SMALL },
                    {
                        id: this.driver.id,
                        type: DriverDetailsCardStringEnum.NEW_MVR,
                    }
                );
                break;
            default:
                break;
        }
    }

    public widthOfProgress(): void {
        let arrMinDate = [];
        let arrMaxDate = [];
        let dateDeactivate = [];
        if (this.driver?.employmentHistories) {
            const sum = this.sumArr.transform(
                this.driver?.employmentHistories.map((item) => {
                    return {
                        id: item.id,
                        value:
                            item.duration.Years * 365.25 + item.duration.Days,
                    };
                })
            );
            this.dataProggress = this.driver?.employmentHistories.map(
                (element) => {
                    let res =
                        element.duration.Years * 365.25 + element.duration.Days;
                    this.activePercentage = (res / sum) * 100;
                    let dates = moment(element.startDate)
                        .min(element.startDate)
                        .format(DriverDetailsCardStringEnum.DATE_FORMAT);
                    let endDate = moment(element.endDate)
                        .max(element.endDate)
                        .format(DriverDetailsCardStringEnum.DATE_FORMAT);
                    arrMinDate.push(new Date(dates));
                    arrMaxDate.push(new Date(endDate));
                    let deactivate = element.isDeactivate;
                    dateDeactivate.push(deactivate);
                    return {
                        ...element,
                        activePercentage: this.activePercentage.toFixed(1),
                    };
                }
            );

            let dateRes = moment(
                new Date(Math.min.apply(null, arrMinDate))
            ).format(DriverDetailsCardStringEnum.DATE_FORMAT);
            if (dateDeactivate.includes(true)) {
                this.deactivatePeriod = true;
            } else {
                this.deactivatePeriod = false;
            }
            this.firstDate = dateRes;
            if (
                !arrMaxDate.includes(DriverDetailsCardStringEnum.INVALID_DATE)
            ) {
                let maxEmpDate = moment(
                    new Date(Math.max.apply(null, arrMaxDate))
                ).format(DriverDetailsCardStringEnum.DATE_FORMAT);
                this.lastDate = maxEmpDate;
            } else {
                this.lastDate = DriverDetailsCardStringEnum.TODAY;
            }
        }
    }

    public getYearsAndDays(data: any): void {
        let sum = 0;
        let sum2 = 0;
        if (data?.employmentHistories) {
            data.employmentHistories.forEach((element) => {
                sum += element.duration.Years;
                sum2 += element.duration.Days;
            });
            let sum3 = sum * 365.25 + sum2;
            this.yearsService = Math.trunc(sum3 / 365.25);
            this.daysService = Math.trunc(sum3 % 365.25);
        }
    }
    public mouseEnter(dat: DriverDateInfo): void {
        this.tooltipData = dat;
        this.tooltipFormatStartDate = moment(
            dat.startDate,
            'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
        ).format('DD MMMM, YYYY');
        this.tooltipFormatEndDate = moment(
            dat.endDate,
            'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
        ).format('DD MMMM, YYYY');
        this.showTooltip = true;
    }
    public getDriversDropdown(): DriverDropdown | void {
        this.driversDropdowns = this.driverMinimalQuery.getAll().map((item) => {
            const fullname = item.firstName + ' ' + item.lastName;
            return {
                id: item.id,
                name: fullname,
                status: item.status,
                svg: item.owner ? DriverImagesStringEnum.OWNER_STATUS : null,
                folder: DriverDetailsCardStringEnum.COMMON,
                active: item.id === this.driver.id,
            };
        });
        this.driversDropdowns = this.driversDropdowns.sort(
            (x, y) => Number(y.status) - Number(x.status)
        );
    }

    public onSelectedDriver(event: DriverDropdown): void {
        if (event && event.id !== this.driver.id) {
            this.driversDropdowns = this.driverMinimalQuery
                .getAll()
                .map((item) => {
                    let fullname = item.firstName + ' ' + item.lastName;
                    return {
                        id: item.id,
                        name: fullname,
                        status: item.status,
                        svg: item.owner
                            ? DriverImagesStringEnum.OWNER_STATUS
                            : null,
                        folder: DriverDetailsCardStringEnum.COMMON,
                        active: item.id === event.id,
                    };
                });
            this.detailsPageDriverSer.getDataDetailId(event.id);
            this.driversDropdowns = this.driversDropdowns.sort(
                (x, y) => Number(y.status) - Number(x.status)
            );
        }
    }

    public onChangeDriver(action: string): void {
        let currentIndex = this.driversDropdowns.findIndex(
            (driver) => driver.id === this.driver.id
        );
        switch (action) {
            case ArrowActionsStringEnum.PREVIOUS:
                currentIndex = --currentIndex;
                if (currentIndex !== -1) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.driversDropdowns[currentIndex].id
                    );
                    /*
                    this.onSelectedDriver({
                        id: this.driversList[currentIndex].id,
                    });  */
                    this.currentDriverIndex = currentIndex;
                }
                break;
            case ArrowActionsStringEnum.NEXT:
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.driversDropdowns.length > currentIndex
                ) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.driversDropdowns[currentIndex].id
                    );
                    /*
                    this.onSelectedDriver({
                        id: this.driversList[currentIndex].id, 
                    });
                    */
                    this.currentDriverIndex = currentIndex;
                    break;
                }
            default:
                break;
        }
    }

    private chartDataSet(
        chart: TaChartComponent,
        config: DoughnutChartConfig,
        legend: LegendAttributes[],
        axes: BarChartAxes,
        item: DriverPayrollResponse,
        hideAnimation?: boolean
    ): void {
        config.dataLabels = [];
        config.chartValues = [item?.miles ?? 0, item?.salary ?? 0];

        legend[0].value = item?.miles ?? 0;
        legend[1].value = item?.salary ?? 0;

        let hasValue = false;

        legend.map((leg) => {
            if (leg.value > 0) hasValue = true;
        });

        config.hasValue = hasValue;

        let miilesCost = [],
            salaryCost = [],
            labels = [],
            first_max_value = 0,
            second_max_value = 0;

        const mapData = item?.getDriverPayrollChartResponse;
        config.dataProperties[0].defaultConfig.barThickness =
            mapData?.length > 17 ? 10 : 18;
        config.dataProperties[1].defaultConfig.barThickness =
            mapData?.length > 17 ? 10 : 18;
        chart.toolTipData = [];
        mapData.map((data) => {
            chart.toolTipData.push(data);
            let first_chart_value = data?.salary ?? 0;
            let second_chart_value = data?.miles ?? 0;
            miilesCost.push(first_chart_value);
            salaryCost.push(second_chart_value);
            if (first_chart_value > first_max_value)
                first_max_value =
                    first_chart_value + (first_chart_value * 7) / 100;

            if (second_chart_value > second_max_value)
                second_max_value =
                    second_chart_value + (second_chart_value * 7) / 100;

            if (data.day)
                labels.push([data.day, this.monthList[data.month - 1]]);
            else labels.push([this.monthList[data.month - 1]]);
        });

        axes.verticalLeftAxes.maxValue = second_max_value;
        axes.verticalRightAxes.maxValue = first_max_value;

        config.dataLabels = labels;
        config.dataProperties[0].defaultConfig.data = miilesCost;
        config.dataProperties[1].defaultConfig.data = salaryCost;
        chart.chartDataCheck(config.chartValues);
        chart.updateChartData(hideAnimation);
        chart.saveValues = JSON.parse(JSON.stringify(legend));
        chart.legendAttributes = JSON.parse(JSON.stringify(legend));
    }

    public getDriverPayrollChartData(
        id: number,
        chartType: number,
        hideAnimation?: boolean
    ): void {
        if (
            id !== this.payrollCall.id ||
            chartType !== this.payrollCall.chartType
        ) {
            this.payrollCall.id = id;
            this.payrollCall.chartType = chartType;
        } else {
            return;
        }
        this.driverService
            .getDriverPayroll(id, chartType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.chartDataSet(
                    this.payrollChart,
                    this.barChartConfig,
                    this.barChartLegend,
                    this.barAxes,
                    item,
                    hideAnimation
                );
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
