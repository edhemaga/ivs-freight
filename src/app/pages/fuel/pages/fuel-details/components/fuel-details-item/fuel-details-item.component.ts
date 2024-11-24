import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

// Components
import { IChartConfiguaration } from 'ca-components/lib/components/ca-chart/models';

// Const
import { FuelDetailsChartsConfiguration } from '@pages/fuel/utils/constants';
import { FuelService } from '@shared/services/fuel.service';
import { Subject, takeUntil } from 'rxjs';
import { FuelStopExpensesResponse } from 'appcoretruckassist';
import { ChartHelper } from '@shared/utils/helpers';
import { ChartConfiguration, ChartLegendConfiguration } from '@shared/utils/constants';
import { ChartLegendProperty, Tabs } from '@shared/models';

@Component({
    selector: 'app-fuel-details-item',
    templateUrl: './fuel-details-item.component.html',
    styleUrls: ['./fuel-details-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class FuelDetailsItemComponent implements OnInit {
    private destroy$ = new Subject<void>();

    @Input() fuelData: any;
    public noteControl: UntypedFormControl = new UntypedFormControl();
    public dummyDataVehicle: any[] = [];
    public dummyDataFuel: any[] = [];
    public dummyData: any;
    public tabsFuel: Tabs[] = ChartHelper.generateTimeTabs();
    public selectedTab: number;
    public fuelDropdown: any;
    public storeDropdown: any;

    // Charts 
    public fuelChartConfig!: IChartConfiguaration;
    public fuelChartLegend!: ChartLegendProperty[];

    public fuelPriceColors: any[] = [
        '#4DB6A2',
        '#81C784',
        '#FFD54F',
        '#FFB74D',
        '#E57373',
        '#919191',
    ];
    constructor(private fuelService: FuelService) { }

    ngOnInit(): void {
        this.initTableOptions();
        this.dummyDataVeh();
        this.dummyDataRep();
        this.fuelDropDown();
        this.storeDropDown();
        this.tabsFuel = [
            {
                id: 221,
                name: '1M',
            },
            {
                id: 511,
                name: '3M',
            },
            {
                id: 416,
                name: '6M',
            },
            {
                id: 511,
                name: '1Y',
            },
            {
                id: 1224,
                name: 'YTD',
            },
            {
                id: 1902,
                name: 'ALL',
            },
        ];
    }
    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }
    /**Function for dots in cards */
    public initTableOptions(): void {
        this.dummyData = {
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
                    title: 'Edit',
                    name: 'edit',
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    show: true,
                },

                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'driver',
                    text: 'Are you sure you want to delete driver(s)?',
                    svg: 'assets/svg/common/ic_trash.svg',
                    danger: true,
                    show: true,
                },
            ],
            export: true,
        };
    }

    public fuelDropDown() {
        let fuelNames = [
            { id: 1, name: 'PILOT TRAVEL STOP 1' },
            { id: 2, name: 'PILOT TRAVEL STOP 2' },
        ];
        this.fuelDropdown = fuelNames.map((item) => {
            return {
                id: item.id,
                name: item.name,
                active: item.id,
            };
        });
    }

    public storeDropDown() {
        let storeNames = [
            { id: 1, name: 'Store 424', pinned: true },
            { id: 2, name: 'Store 555', pinned: null },
        ];
        this.storeDropdown = storeNames.map((item) => {
            return {
                id: item.id,
                name: item.name,
                svg: item.pinned ? 'ic_star.svg' : null,
                folder: 'common',
                active: item.id,
            };
        });
    }
    public dummyDataVeh() {
        this.dummyDataVehicle = [
            {
                unit: 'R53202',
                icon: 'assets/svg/common/trailers/ic_trailer_low-boy.svg',
                key: '24',
                cost: '132,567,25',
            },
            {
                unit: 'R53202',
                icon: 'assets/svg/common/trailers/ic_trailer_step-deck.svg',
                key: '54',
                cost: '132,567,25',
            },
            {
                unit: 'R53202',
                icon: 'assets/svg/common/trailers/ic_trailer_step-deck.svg',
                key: '234',
                cost: '132,567,25',
            },
            {
                unit: 'R53202',
                icon: 'assets/svg/common/trailers/ic_trailer_flatbed.svg',
                key: '42',
                cost: '132,567,25',
            },
        ];
    }
    public changeTab(ev: any) {
        this.selectedTab = ev.id;
        this.getFuelExpenses(this.selectedTab);
    }
    public dummyDataRep() {
        this.dummyDataFuel = [
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
            {
                unit: 'R53201',
                driver: 'A. Djordjevic',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: true,
            },
            {
                unit: 'R53201',
                driver: 'Angello Trotter',
                fuel_card: '8732...233',
                date: '08/10/20',
                time: '10:01 AM',
                category: 'Diesel ● DEF ● Scale Tick…',
                fuel_g: '25.74',
                ppg: '4.55',
                icon: 'assets/svg/common/round_blue_light.svg',
                cost: '785.53',
                blue_back: false,
            },
        ];
    }

    private getFuelExpenses(timeFilter?: number): void {
        this.fuelService.getFuelExpensesGet(this.fuelData.id, timeFilter || 1).pipe(takeUntil(this.destroy$))
            .subscribe((response: FuelStopExpensesResponse) => {
                this.fuelChartConfig = {
                    ...FuelDetailsChartsConfiguration.FUEL_CHART_CONFIG,
                    chartData: ChartHelper.generateDataByDateTime(response.fuelStopExpensesChartResponse,
                        ChartConfiguration.fuelExpensesConfiguration
                    )
                }
                this.fuelChartLegend = ChartLegendConfiguration.fuelExpensesLegend(response);
            })
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
