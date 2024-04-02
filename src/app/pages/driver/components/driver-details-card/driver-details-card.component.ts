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
import { Subject, takeUntil } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';

//Pipes
import { SumArraysPipe } from 'src/app/core/pipes/sum-arrays.pipe';

//Animations
import { card_component_animation } from 'src/app/core/components/shared/animations/card-component.animations';

//Helpers
import { dropActionNameDriver } from 'src/app/core/utils/function-drop.details-page';
import moment from 'moment';
import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import { onFileActionMethods } from 'src/app/core/utils/methods.globals';

//Services
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { ConfirmationService } from 'src/app/core/components/modals/confirmation-modal/state/state/services/confirmation.service';
import { CdlTService } from '../../services/cdl.service';
import { MedicalTService } from '../../services/medical.service';
import { MvrTService } from '../../services/mvr.service';
import { TestTService } from '../../services/test.service';
import { DriverTService } from '../../services/driver.service';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';

//Components
import { DriverCdlModalComponent } from 'src/app/core/components/modals/driver-modal/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholModalComponent } from 'src/app/core/components/modals/driver-modal/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverMedicalModalComponent } from 'src/app/core/components/modals/driver-modal/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from 'src/app/core/components/modals/driver-modal/driver-mvr-modal/driver-mvr-modal.component';
import { TaChartComponent } from 'src/app/core/components/standalone-components/ta-chart/ta-chart.component';

//Store
import { DriversMinimalListQuery } from '../../state/driver-details-minimal-list-state/driver-minimal-list.query';

//Enums
import { SETTINGS_ARROW_ACTIONS } from 'src/app/pages/settings/enums/settings-arrow-actions.enum';
import { BrokerTabEnum } from '../../../customer/pages/broker-details/enums/broker-enum';
import { DriverEnum } from '../../enums/driver-details-card.enum';
import { DriverImagesEnum } from '../../enums/driver-images.enum';

//Models
import { DoughnutChartConfig } from '../../../dashboard/models/dashboard-chart-models/doughnut-chart.model';
import {
    ChartApiCall,
    LegendAttributes,
} from 'src/app/core/components/standalone-components/ta-chart/models/chart-models';
import { BarChartAxes } from '../../../dashboard/models/dashboard-chart-models/bar-chart.model';
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
import { TabOptions } from 'src/app/core/components/standalone-components/ta-tab-switch/state/models/tab-models';
import {
    DriverDateInfo,
    DriverDropdowns,
} from '../../models/driver-details-card.model';

//Constants
import { ChartConstants } from 'src/app/core/components/standalone-components/ta-chart/utils/constants/chart.constants';
import { DriverConstants } from '../../utils/constants/driver-details-card.constants';

@Component({
    selector: 'app-driver-details-card',
    templateUrl: './driver-details-card.component.html',
    styleUrls: ['./driver-details-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [card_component_animation('showHideCardBody')],
    providers: [SumArraysPipe],
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
    public isAccountVisibleDriver: boolean = false;
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
    public driversDropdowns: DriverDropdowns[];
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
        DriverConstants.BAR_CHART_CONFIG;
    public barChartLegend: LegendAttributes[] =
        DriverConstants.BAR_CHART_LEGEND;
    public barAxes: BarChartAxes = DriverConstants.BAR_CHART_AXES;

    public payrollCall: ChartApiCall = {
        id: -1,
        chartType: 1,
    };
    private monthList: string[] = ChartConstants.MONTH_LIST_SHORT;

    private destroy$ = new Subject<void>();

    constructor(
        private modalService: ModalService,
        private detailsPageDriverSer: DetailsPageService,
        private sumArr: SumArraysPipe,
        private cdRef: ChangeDetectorRef,
        private tableService: TruckassistTableService,
        private driverMinimalQuery: DriversMinimalListQuery,
        public imageBase64Service: ImageBase64Service,
        private cdlService: CdlTService,
        private medicalService: MedicalTService,
        private mvrService: MvrTService,
        private testService: TestTService,
        private driverService: DriverTService,
        private confirmationService: ConfirmationService,
        private dropDownService: DropDownService
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
                            case DriverEnum.DELETE_2:
                                if (res.template === DriverEnum.CDL_2)
                                    this.deleteCdlByIdFunction(res.id);
                                else if (res.template === DriverEnum.MEDICAL_2)
                                    this.deleteMedicalByIdFunction(res.id);
                                else if (res.template === DriverEnum.MVR_2)
                                    this.deleteMvrByIdFunction(res.id);
                                else if (res.template === DriverEnum.TEST_2)
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
            case DriverEnum.CDL_2:
                this.templateName = false;
                this.initTableOptions();
                this.getExpireDate(this.driver);
                break;
            case DriverEnum.TEST_2:
                this.templateName = true;
                this.initTableOptions();
                break;
            case DriverEnum.MEDICAL_2:
                this.templateName = true;
                this.initTableOptions();
                break;
            case DriverEnum.MVR_2:
                this.templateName = true;
                this.initTableOptions();
                break;
        }
    }

    public tabsButton(): void {
        this.tabsDriver = [
            {
                id: 223,
                name: BrokerTabEnum.ONE_MONTH,
                checked: true,
            },
            {
                id: 313,
                name: BrokerTabEnum.THREE_MONTHS,
                checked: false,
            },
            {
                id: 412,
                name: BrokerTabEnum.SIX_MONTHS,
                checked: false,
            },
            {
                id: 515,
                name: BrokerTabEnum.ONE_YEAR,
                checked: false,
            },
            {
                id: 1210,
                name: BrokerTabEnum.YEAR_TO_DATE,
                checked: false,
            },
            {
                id: 1011,
                name: BrokerTabEnum.ALL,
                checked: false,
            },
        ];
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
        const name = dropActionNameDriver(eventData, action);
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
                    title: DriverEnum.EDIT,
                    name: DriverEnum.EDIT_2,
                    svg: DriverImagesEnum.EDIT,
                    show: true,
                },
                {
                    title: DriverEnum.RENEW,
                    name: DriverEnum.RENEW_2,
                    svg: DriverImagesEnum.RENEW,
                    show: !this.templateName ? true : false,
                },
                {
                    title: DriverEnum.VOID,
                    name: DriverEnum.ACTIVATE_ITEM,
                    svg: DriverImagesEnum.CANCEL,
                    show: !this.templateName ? true : false,
                },
                {
                    title: DriverEnum.DELETE,
                    name: DriverEnum.DELETE_ITEM,
                    type: DriverEnum.DRIVER_2,
                    text: DriverEnum.DELETE_DRIVER_MESSAGE,
                    svg: DriverImagesEnum.DELETE,
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
                    title: DriverEnum.SEND_MESSAGE,
                    name: DriverEnum.DM,
                    svg: DriverImagesEnum.DM,
                    show: data.status === 1 ? true : false,
                },
                {
                    title: DriverEnum.PRINT,
                    name: DriverEnum.PRINT_2,
                    svg: DriverImagesEnum.PRINT,
                    show: data.status === 1 || data.status === 0 ? true : false,
                },

                {
                    title: DriverEnum.EDIT,
                    name: DriverEnum.EDIT_2,
                    svg: DriverImagesEnum.EDIT,
                    show: data.status === 1 ? true : false,
                },
                {
                    title:
                        data.status === 0
                            ? DriverEnum.ACTIVATE
                            : DriverEnum.DEACTIVATE,
                    name: DriverEnum.DEACTIVATE_2,
                    svg: DriverImagesEnum.DEACTIVATE,
                    activate: data.status === 0 ? true : false,
                    deactivate: data.status === 1 ? true : false,
                    show: data.status === 1 || data.status === 0 ? true : false,
                },
                {
                    title: DriverEnum.DELETE,
                    name: DriverEnum.DELETE_ITEM,
                    type: DriverEnum.DRIVER_2,
                    text: DriverEnum.DELETE_DRIVER_MESSAGE,
                    svg: DriverImagesEnum.DELETE,
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
        if (action.includes(DriverEnum.DRUG)) action = DriverEnum.DRUG_ALCOHOL;
        switch (action) {
            case DriverEnum.CDL:
                this.modalService.openModal(
                    DriverCdlModalComponent,
                    { size: DriverEnum.SMALL },
                    { id: this.driver.id, type: DriverEnum.NEW_LICENCE }
                );
                break;
            case DriverEnum.DRUG_ALCOHOL:
                this.modalService.openModal(
                    DriverDrugAlcoholModalComponent,
                    { size: DriverEnum.SMALL },
                    { id: this.driver.id, type: DriverEnum.NEW_DRUG }
                );

                break;
            case DriverEnum.MEDICAL:
                this.modalService.openModal(
                    DriverMedicalModalComponent,
                    { size: DriverEnum.SMALL },
                    { id: this.driver.id, type: DriverEnum.NEW_MEDICAL }
                );
                break;
            case DriverEnum.MVR:
                this.modalService.openModal(
                    DriverMvrModalComponent,
                    { size: DriverEnum.SMALL },
                    { id: this.driver.id, type: DriverEnum.NEW_MVR }
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
                        .format(DriverEnum.DATE_FORMAT);
                    let endDate = moment(element.endDate)
                        .max(element.endDate)
                        .format(DriverEnum.DATE_FORMAT);
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
            ).format(DriverEnum.DATE_FORMAT);
            if (dateDeactivate.includes(true)) {
                this.deactivatePeriod = true;
            } else {
                this.deactivatePeriod = false;
            }
            this.firstDate = dateRes;
            if (!arrMaxDate.includes(DriverEnum.INVALID_DATE)) {
                let maxEmpDate = moment(
                    new Date(Math.max.apply(null, arrMaxDate))
                ).format(DriverEnum.DATE_FORMAT);
                this.lastDate = maxEmpDate;
            } else {
                this.lastDate = DriverEnum.TODAY;
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
    public getDriversDropdown(): DriverDropdowns | void {
        this.driversDropdowns = this.driverMinimalQuery.getAll().map((item) => {
            const fullname = item.firstName + ' ' + item.lastName;
            return {
                id: item.id,
                name: fullname,
                status: item.status,
                svg: item.owner ? DriverImagesEnum.OWNER_STATUS : null,
                folder: DriverEnum.COMMON,
                active: item.id === this.driver.id,
            };
        });
        this.driversDropdowns = this.driversDropdowns.sort(
            (x, y) => Number(y.status) - Number(x.status)
        );
    }

    public onSelectedDriver(event: DriverDropdowns): void {
        if (event && event.id !== this.driver.id) {
            this.driversDropdowns = this.driverMinimalQuery
                .getAll()
                .map((item) => {
                    let fullname = item.firstName + ' ' + item.lastName;
                    return {
                        id: item.id,
                        name: fullname,
                        status: item.status,
                        svg: item.owner ? DriverImagesEnum.OWNER_STATUS : null,
                        folder: DriverEnum.COMMON,
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
            case SETTINGS_ARROW_ACTIONS.PREVIOUS:
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
            case SETTINGS_ARROW_ACTIONS.NEXT:
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
    public onFileAction(action: string): void {
        onFileActionMethods(action);
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
