import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// services
import { DriverService } from '@pages/driver/services/driver.service';
import { DetailsPageService } from '@shared/services/details-page.service';
import { ModalService } from '@shared/services/modal.service';

// components
//import { TaChartComponent } from '@shared/components/ta-chart/ta-chart.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { DriverDetailsTitleCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-details-title-card/driver-details-title-card.component';
import { DriverDetailsAssignToCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-details-assign-to-card/driver-details-assign-to-card.component';
import { DriverDetailsAdditionalInfoCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-details-additional-info-card/driver-details-additional-info-card.component';
import { DriverEmploymentHistoryCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-employment-history-card/driver-employment-history-card.component';
import { DriverOwnerInfoCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-owner-info-card/driver-owner-info-card.component';
import { DriverPayTypesCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-pay-types-card/driver-pay-types-card.component';
import { DriverBankInfoCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-bank-info-card/driver-bank-info-card.component';
import { DriverOffDutyLocationCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-off-duty-location-card/driver-off-duty-location-card.component';
import { DriverEmergencyContactCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-emergency-contact-card/driver-emergency-contact-card.component';
import { DriverNotificationCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-notification-card/driver-notification-card.component';
import { DriverModalComponent } from '@pages/driver/pages/driver-modals/driver-modal/driver-modal.component';

// constants
import { ChartConstants } from '@shared/components/ta-chart/utils/constants/chart.constants';
import { DriverDetailsCardConstants } from '@pages/driver/pages/driver-details/components/driver-details-card/utils/constants/driver-details-card.constants';
import { DriverDetailsCardSvgRoutes } from '@pages/driver/pages/driver-details/components/driver-details-card/utils/svg-routes/driver-details-card-svg-routes';

// store
import { DriversMinimalListQuery } from '@pages/driver/state/driver-details-minimal-list-state/driver-minimal-list.query';

// enums
import { ArrowActionsStringEnum } from '@shared/enums/arrow-actions-string.enum';
import { DriverDetailsCardStringEnum } from '@pages/driver/pages/driver-details/components/driver-details-card/enums/driver-details-card-string.enum';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// models
import { DoughnutChartConfig } from '@pages/dashboard/models/dashboard-chart-models/doughnut-chart.model';
import { ChartApiCall } from '@shared/components/ta-chart/models/chart-api-call.model';
import { LegendAttributes } from '@shared/components/ta-chart/models/legend-attributes.model';
import { BarChartAxes } from '@pages/dashboard/models/dashboard-chart-models/bar-chart.model';
import {
    DriverMinimalResponse,
    DriverPayrollResponse,
    DriverResponse,
} from 'appcoretruckassist';
import { TabOptions } from '@shared/components/ta-tab-switch/models/tab-options.model';

@Component({
    selector: 'app-driver-details-card',
    templateUrl: './driver-details-card.component.html',
    styleUrls: ['./driver-details-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,

        // components
        TaTabSwitchComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        //TaChartComponent,
        DriverDetailsTitleCardComponent,
        DriverDetailsAssignToCardComponent,
        DriverDetailsAdditionalInfoCardComponent,
        DriverEmploymentHistoryCardComponent,
        DriverOwnerInfoCardComponent,
        DriverPayTypesCardComponent,
        DriverBankInfoCardComponent,
        DriverOffDutyLocationCardComponent,
        DriverEmergencyContactCardComponent,
        DriverNotificationCardComponent,
    ],
})
export class DriverDetailsCardComponent
    implements OnInit, OnChanges, OnDestroy
{
    //@ViewChild('payrollChart') public payrollChart: TaChartComponent;

    @Input() driver: DriverResponse;

    private destroy$ = new Subject<void>();

    public driverCurrentIndex: number;

    // drivers dropdown
    public driversDropdownList: DriverMinimalResponse[];

    // payroll chart card
    public barChartTabs: TabOptions[];
    public barChartConfig: DoughnutChartConfig;
    public barChartLegend: LegendAttributes[];
    public barAxes: BarChartAxes;

    private barChartPayrollCall: ChartApiCall;
    private barChartMonthList: string[];

    // note card
    public noteForm: UntypedFormGroup;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private detailsPageService: DetailsPageService,
        private driverService: DriverService,
        private modalService: ModalService,

        // store
        private driverMinimalQuery: DriversMinimalListQuery
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getStoreData(true);

        this.getCurrentIndex();

        this.getDriversDropdown();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes?.driver?.firstChange && changes?.driver.currentValue) {
            this.getDriversDropdown();

            this.getDriverPayrollChartData(
                changes.driver.currentValue.id,
                this.barChartPayrollCall.chartType,
                false
            );
        }
    }

    private createForm(): void {
        this.noteForm = this.formBuilder.group({
            note: [this.driver.note],
        });
    }

    private getConstantData(): void {
        this.barChartTabs = JSON.parse(
            JSON.stringify(DriverDetailsCardConstants.BAR_CHART_TABS)
        );

        //this.barChartConfig = DriverDetailsCardConstants.BAR_CHART_CONFIG;
        this.barChartLegend = DriverDetailsCardConstants.BAR_CHART_LEGEND;
        this.barAxes = DriverDetailsCardConstants.BAR_CHART_AXES;
        this.barChartPayrollCall =
            DriverDetailsCardConstants.BAR_CHART_PAYROLL_API_CALL;

        this.barChartMonthList = ChartConstants.MONTH_LIST_SHORT;
    }

    private getStoreData(isInit: boolean = false): void {
        if (isInit) {
            this.driversDropdownList = this.driverMinimalQuery.getAll();
        } else {
            this.driverMinimalQuery
                .selectAll()
                .pipe(takeUntil(this.destroy$))
                .subscribe((drivers) => (this.driversDropdownList = drivers));
        }
    }

    private getCurrentIndex(): void {
        setTimeout(() => {
            const currentIndex = this.driversDropdownList.findIndex(
                (driver) => driver.id === this.driver.id
            );

            this.driverCurrentIndex = currentIndex;
        }, 300);
    }

    public getDriversDropdown(): DriverMinimalResponse | void {
        this.driversDropdownList = this.driverMinimalQuery
            .getAll()
            .map((driver) => {
                const { id, firstName, lastName, owner, hiredAt } = driver;

                const fullname =
                    firstName +
                    DriverDetailsCardStringEnum.EMPTY_STRING +
                    lastName;

                return {
                    ...driver,
                    name: fullname,
                    svg: owner
                        ? DriverDetailsCardSvgRoutes.ownerStatusRoute
                        : null,
                    folder: DriverDetailsCardStringEnum.COMMON,
                    active: id === this.driver.id,
                    hiredAt: hiredAt
                        ? MethodsCalculationsHelper.convertDateFromBackend(
                              hiredAt
                          )
                        : null,
                };
            });

        this.driversDropdownList = this.driversDropdownList.sort(
            (x, y) => Number(y.status) - Number(x.status)
        );
    }

    public getDriverPayrollChartData(
        id: number,
        chartType: number,
        hideAnimation?: boolean
    ): void {
        if (
            id !== this.barChartPayrollCall.id ||
            chartType !== this.barChartPayrollCall.chartType
        ) {
            this.barChartPayrollCall.id = id;
            this.barChartPayrollCall.chartType = chartType;
        } else {
            return;
        }

        this.driverService
            .getDriverPayroll(id, chartType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.setChartData(
                    //this.payrollChart,
                    this.barChartConfig,
                    this.barChartLegend,
                    this.barAxes,
                    item,
                    hideAnimation
                );
            });
    }

    private setChartData(
        //chart: TaChartComponent,
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

        //chart.toolTipData = [];

        mapData.map((data) => {
            //chart.toolTipData.push(data);

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
                labels.push([data.day, this.barChartMonthList[data.month - 1]]);
            else labels.push([this.barChartMonthList[data.month - 1]]);
        });

        axes.verticalLeftAxes.maxValue = second_max_value;
        axes.verticalRightAxes.maxValue = first_max_value;

        config.dataLabels = labels;

        config.dataProperties[0].defaultConfig.data = miilesCost;
        config.dataProperties[1].defaultConfig.data = salaryCost;

        // chart.chartDataCheck(config.chartValues);
        // chart.updateChartData(hideAnimation);

        // chart.saveValues = JSON.parse(JSON.stringify(legend));
        // chart.legendAttributes = JSON.parse(JSON.stringify(legend));
    }

    public onPayrollTabChange(tab: TabOptions): void {
        //const chartType = this.payrollChart?.detailsTimePeriod(tab.name);

        //this.getDriverPayrollChartData(this.driver.id, chartType);
    }

    public onSelectedDriver(event: DriverMinimalResponse): void {
        if (event?.id !== this.driver.id) {
            this.driversDropdownList = this.driverMinimalQuery
                .getAll()
                .map((driver) => {
                    const { id, firstName, lastName, status, owner } = driver;

                    const fullname =
                        firstName +
                        DriverDetailsCardStringEnum.EMPTY_STRING +
                        +lastName;

                    return {
                        id,
                        name: fullname,
                        status,
                        svg: owner
                            ? DriverDetailsCardSvgRoutes.ownerStatusRoute
                            : null,
                        folder: DriverDetailsCardStringEnum.COMMON,
                        active: id === event.id,
                    };
                });

            this.detailsPageService.getDataDetailId(event.id);

            this.driversDropdownList = this.driversDropdownList.sort(
                (x, y) => Number(y.status) - Number(x.status)
            );
        }
    }

    public onChangeDriver(action: string): void {
        let currentIndex = this.driversDropdownList.findIndex(
            (driver) => driver.id === this.driver.id
        );

        switch (action) {
            case ArrowActionsStringEnum.PREVIOUS:
                currentIndex = --currentIndex;

                if (currentIndex !== -1) {
                    this.detailsPageService.getDataDetailId(
                        this.driversDropdownList[currentIndex].id
                    );

                    this.driverCurrentIndex = currentIndex;
                }

                break;
            case ArrowActionsStringEnum.NEXT:
                currentIndex = ++currentIndex;

                if (
                    currentIndex !== -1 &&
                    this.driversDropdownList.length > currentIndex
                ) {
                    this.detailsPageService.getDataDetailId(
                        this.driversDropdownList[currentIndex].id
                    );

                    this.driverCurrentIndex = currentIndex;

                    break;
                }
            default:
                break;
        }
    }

    public handleDriverDetailsTitleCardEmit(event: any): void {
        switch (event.type) {
            case DriverDetailsCardStringEnum.SELECT_DRIVER:
                if (event.event.name === DriverDetailsCardStringEnum.ADD_NEW) {
                    this.modalService.openModal(DriverModalComponent, {
                        size: DriverDetailsCardStringEnum.MEDIUM,
                    });

                    return;
                }

                this.onSelectedDriver(event.event);

                break;
            case DriverDetailsCardStringEnum.CHANGE_DRIVER:
                this.onChangeDriver(event.event);

                break;
            default:
                break;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
