import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnChanges,
    OnDestroy,
    ViewChild,
    Input,
    SimpleChanges,
    HostListener,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import {
    animate,
    style,
    transition,
    trigger,
    state,
} from '@angular/animations';

import { Subject, takeUntil } from 'rxjs';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { TruckService } from '@shared/services/truck.service';

// animations
import { cardComponentAnimation } from '@shared/animations/card-component.animation';

// store
import { TrucksMinimalListQuery } from '@pages/truck/state/truck-details-minima-list-state/truck-details-minimal.query';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TruckDetailsEnum } from '@pages/truck/pages/truck-details/enums/truck-details.enum';

// constants
import { TruckDetailsConstants } from '@pages/truck/pages/truck-details/utils/constants/truck-details.constants';

// models
import { TruckResponse, TruckPerformanceResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-truck-details-card',
    templateUrl: './truck-details-card.component.html',
    styleUrls: ['./truck-details-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        cardComponentAnimation('showHideCardBody'),
        trigger('ownerDetailsAnimation', [
            state(
                'true',
                style({
                    height: '*',
                    overflow: 'hidden',
                    opacity: 1,
                })
            ),
            state(
                'false',
                style({
                    height: '0px',
                    overflow: 'hidden',
                    opacity: 0,
                })
            ),
            transition('false <=> true', [animate('0.2s ease')]),
            transition('true <=> false', [animate('0.2s ease')]),
        ]),
    ],
})
export class TruckDetailsCardComponent implements OnInit, OnChanges, OnDestroy {
    public stackedBarChart: any;
    public noteControl: UntypedFormControl = new UntypedFormControl();
    public fhwaNote: UntypedFormControl = new UntypedFormControl();
    public registrationNote: UntypedFormControl = new UntypedFormControl();
    public titleNote: UntypedFormControl = new UntypedFormControl();
    public buttonsArrayPerfomance: any;
    public buttonsArrayFuel: any;
    public buttonsArrayRevenue: any;
    public toggler: boolean[] = [];
    public togglerOwner: boolean;
    public truckDropDowns: any[] = [];
    public dataEdit: any;
    private destroy$ = new Subject<void>();
    @Input() templateCard: boolean = false;
    @Input() truck: TruckResponse;
    public ownersData: any;
    public truck_list: any[] = this.truckMinimalListQuery.getAll();
    //private monthList: string[] = ChartConstants.MONTH_LIST_SHORT;
    public ownerCardOpened: boolean = true;
    public featureNumber: number = 0;
    payrollChartConfig: any = {
        dataProperties: [
            {
                defaultConfig: {
                    type: 'line',
                    data: [],
                    label: 'Salary',
                    yAxisID: 'y-axis-1',
                    borderColor: '#6D82C7',
                    pointBackgroundColor: '#FFFFFF',
                    pointHoverBackgroundColor: '#6D82C7',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                },
            },
            {
                defaultConfig: {
                    type: 'bar',
                    data: [],
                    label: 'Miles',
                    yAxisID: 'y-axis-0',
                    borderColor: '#FFCC80',
                    backgroundColor: '#FFCC80',
                    hoverBackgroundColor: '#FFA726',
                    barThickness: 18,
                },
            },
        ],
        showLegend: false,
        chartValues: [0, 0],
        defaultType: 'bar',
        chartWidth: '417',
        chartHeight: '130',
        hasValue: false,
        dataLabels: [],
        onHoverAnnotation: true,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        hoverTimeDisplay: true,
        noChartImage: 'assets/svg/common/yellow_no_data.svg',
        showHoverTooltip: true,
        showZeroLine: true,
    };

    revenueChartConfig: any = {
        dataProperties: [
            {
                defaultConfig: {
                    type: 'line',
                    data: [],
                    label: 'Salary',
                    yAxisID: 'y-axis-1',
                    borderColor: '#6D82C7',
                    pointBackgroundColor: '#FFFFFF',
                    pointHoverBackgroundColor: '#6D82C7',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                },
            },
            {
                defaultConfig: {
                    type: 'bar',
                    data: [],
                    label: 'Miles',
                    yAxisID: 'y-axis-0',
                    borderColor: '#B2DFD1',
                    backgroundColor: '#B2DFD1',
                    hoverBackgroundColor: '#4DB6A2',
                    barThickness: 18,
                },
            },
        ],
        showLegend: false,
        chartValues: [],
        defaultType: 'bar',
        chartWidth: '417',
        chartHeight: '130',
        hasValue: false,
        dataLabels: [],
        onHoverAnnotation: true,
        hoverTimeDisplay: true,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        noChartImage: 'assets/svg/common/green_no_data.svg',
        hasSameDataIndex: true,
        showHoverTooltip: true,
        showZeroLine: true,
    };

    stackedBarChartConfig: any = {
        dataProperties: [
            {
                defaultConfig: {
                    type: 'bar',
                    data: [],
                    label: 'Miles',
                    yAxisID: 'y-axis-0',
                    borderColor: '#FFCC80',
                    backgroundColor: '#FFCC80',
                    hoverBackgroundColor: '#FFA726',
                    hoverBorderColor: '#FFA726',
                    barThickness: 18,
                },
            },
            {
                defaultConfig: {
                    type: 'bar',
                    data: [],
                    label: 'Miles',
                    yAxisID: 'y-axis-0',
                    borderColor: '#97A8DC',
                    backgroundColor: '#97A8DC',
                    hoverBackgroundColor: '#536BC2',
                    hoverBorderColor: '#536BC2',
                    barThickness: 18,
                },
            },
        ],
        showLegend: false,
        chartValues: [0, 0, 0],
        defaultType: 'bar',
        chartWidth: '417',
        chartHeight: '130',
        hasValue: false,
        dataLabels: [],
        onHoverAnnotation: true,
        hoverTimeDisplay: true,
        stacked: true,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        noChartImage: 'assets/svg/common/stacked_no_data.svg',
        showHoverTooltip: true,
        showZeroLine: true,
    };

    public performance: TruckPerformanceResponse;
    public isWideScreen: boolean = false;
    public ownerHistoryHeader: { label: string }[] =
        TruckDetailsConstants.ownerHistoryHeader;

    constructor(
        private detailsPageDriverSer: DetailsPageService,
        private truckMinimalListQuery: TrucksMinimalListQuery,
        private truckService: TruckService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes?.truck.firstChange && changes?.truck) {
            this.noteControl.patchValue(changes.truck.currentValue.note);
            this.getTruckDropdown();
        }
        this.setFeatureNumber(this.truck);
        this.checkWidth(window.innerWidth);

        //this.getTruckChartData(changes.truck.currentValue.id);

        this.changeColor();
        this.truckMinimalListQuery
            .selectAll()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.truck_list = item));
    }
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.checkWidth(event.target.innerWidth);
    }

    checkWidth(width: number) {
        this.isWideScreen = width > 1508; // Adjust the width threshold as needed
    }
    ngOnInit(): void {
        this.noteControl.patchValue(this.truck.note);
        this.getTruckDropdown();
        this.buttonSwitcher();
        this.initTableOptions();

        let array1 = [...this.truck.ownerHistories];

        array1.sort((a, b) => {
            return b.id - a.id;
        });
        //this.truck.ownerHistories = array1;
        this.ownersData = array1;
        // setTimeout(() => {
        //     let currentIndex = this.truckDropDowns.findIndex(
        //         (truck) => truck.id === this.truck.id
        //     );

        //     this.truckIndex = currentIndex;
        // }, 300);
    }

    public sortKeys = (a, b) => {
        return a.value.id > b.value.id ? -1 : 1;
    };

    public changeColor() {
        document.documentElement.style.setProperty(
            '--dynamic-colour',
            this.truck?.color?.code ? this.truck.color.code : '#aaa'
        );
    }

    public buttonSwitcher() {
        this.buttonsArrayPerfomance = [
            {
                id: 5,
                name: '1M',
                checked: true,
            },
            {
                id: 10,
                name: '3M',
            },
            {
                id: 12,
                name: '6M',
            },
            {
                id: 15,
                name: '1Y',
            },
            {
                id: 20,
                name: 'YTD',
            },
            {
                id: 30,
                name: 'ALL',
            },
        ];
        this.buttonsArrayRevenue = [
            {
                id: 36,
                name: '1M',
                checked: true,
            },
            {
                id: 66,
                name: '3M',
            },
            {
                id: 97,
                name: '6M',
            },
            {
                id: 99,
                name: '1Y',
            },
            {
                id: 101,
                name: 'YTD',
            },
            {
                id: 103,
                name: 'ALL',
            },
        ];
        this.buttonsArrayFuel = [
            {
                id: 222,
                name: '1M',
                checked: true,
            },
            {
                id: 333,
                name: '3M',
            },
            {
                id: 444,
                name: '6M',
            },
            {
                id: 555,
                name: '1Y',
            },
            {
                id: 231,
                name: 'YTD',
            },
            {
                id: 213,
                name: 'ALL',
            },
        ];
    }

    /**Function for dots in cards */
    public initTableOptions(): void {
        this.dataEdit = {
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
                    title: TableStringEnum.EDIT_2,
                    name: TableStringEnum.EDIT,
                    class: TableStringEnum.REGULAR_TEXT,
                    contentType: TableStringEnum.EDIT,
                },

                {
                    title: TableStringEnum.DELETE_2,
                    name: TableStringEnum.DELETE_ITEM,
                    type: TableStringEnum.DRIVER,
                    text: 'Are you sure you want to delete driver(s)?',
                    class: TableStringEnum.DELETE_TEXT,
                    iconName: TableStringEnum.DELETE,
                },
            ],
            export: true,
        };
    }

    /**Function for toggle page in cards */
    public toggleResizePage(value: number, indexName: string) {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }

    /**Function retrun id */
    public identity(index: number, _: any): number {
        return index;
    }
    public getTruckDropdown() {
        this.truckDropDowns = this.truckMinimalListQuery
            .getAll()
            .map((item) => {
                return {
                    id: item.id,
                    name: item.truckNumber,
                    status: item.status,
                    svg: item.truckType.logoName,
                    folder: 'common/trucks',
                    active: item.id === this.truck.id,
                    owner: item.owner,
                };
            });

        this.truckDropDowns = this.truckDropDowns.sort(
            (x, y) => Number(y.status) - Number(x.status)
        );
    }

    public onSelectedTruck(event: any) {
        if (event && event.id !== this.truck.id) {
            this.truckDropDowns = this.truckMinimalListQuery
                .getAll()
                .map((item) => {
                    return {
                        id: item.id,
                        name: item.truckNumber,
                        svg: item.truckType.logoName,
                        folder: 'common/trucks',
                        status: item.status,
                        active: item.id === event.id,
                    };
                });
            this.detailsPageDriverSer.getDataDetailId(event.id);

            this.truckDropDowns = this.truckDropDowns.sort(
                (x, y) => Number(y.status) - Number(x.status)
            );
        }
    }
    public onChangeTruck(action: string) {
        let currentIndex = this.truckDropDowns.findIndex(
            (truck) => truck.id === this.truck.id
        );

        switch (action) {
            case TruckDetailsEnum.PREVIOUS: {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.truckDropDowns[currentIndex].id
                    );
                    this.onSelectedTruck({
                        id: this.truckDropDowns[currentIndex].id,
                    });
                    //this.truckIndex = currentIndex;
                }
                break;
            }
            case TruckDetailsEnum.NEXT: {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.truckDropDowns.length > currentIndex
                ) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.truckDropDowns[currentIndex].id
                    );
                    this.onSelectedTruck({
                        id: this.truckDropDowns[currentIndex].id,
                    });
                    //this.truckIndex = currentIndex;
                }

                break;
            }
            default: {
                break;
            }
        }
    }

    public onOpenCloseCard(mod: any) {
        this.ownerCardOpened = mod;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public setFeatureNumber(truck: TruckResponse): void {
        this.featureNumber = 0;
        if (truck.doubleBunk) {
            this.featureNumber++;
        }
        if (truck.refrigerator) {
            this.featureNumber++;
        }
        if (truck.blower) {
            this.featureNumber++;
        }
        if (truck.pto) {
            this.featureNumber++;
        }
        if (truck.dashCam) {
            this.featureNumber++;
        }
        if (truck.headacheRack) {
            this.featureNumber++;
        }
        if (truck.dcInverter) {
            this.featureNumber++;
        }
    }

    public getLastSixChars(mod: string): string | string[] {
        let lastSixChars: string | string[] = mod;

        if (mod.length > 6) {
            lastSixChars = mod.slice(-6);

            let stringLength = mod.length;
            let firsNum = stringLength - 6;
            lastSixChars = [mod.slice(0, firsNum), mod.slice(-6)];
        }
        return lastSixChars;
    }
}
