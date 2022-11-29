import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
    ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ShipperMinimalListQuery } from '../state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal.query';
import { DetailsPageService } from '../../../services/details-page/details-page-ser.service';

@Component({
    selector: 'app-shipper-card-view',
    templateUrl: './shipper-card-view.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./shipper-card-view.component.scss'],
})
export class ShipperCardViewComponent implements OnInit, OnChanges {
    @ViewChild('stackedBarChart', { static: false })
    public stackedBarChart: any;
    @Input() shipper: any;
    @Input() templateCard: boolean;
    public shipperDropdowns: any[] = [];
    public shipperList: any[] = this.shipperMinimalListQuery.getAll();
    public note: FormControl = new FormControl();
    public shipperTabs: any[] = [];

    stackedBarChartConfig: any = {
        dataProperties: [
            {
                defaultConfig: {
                    type: 'bar',
                    data: [20, 17, 30, 23, 27, 25, 19, 29, 22, 25, 22, 20],
                    label: 'Miles',
                    yAxisID: 'y-axis-0',
                    borderColor: '#80CBBA',
                    backgroundColor: '#80CBBA',
                    hoverBackgroundColor: '#26A690',
                    hoverBorderColor: '#26A690',
                    barThickness: 18,
                },
            },
            {
                defaultConfig: {
                    type: 'bar',
                    data: [
                        -20, -25, -21, -22, -15, -26, -24, -21, -23, -24, -25,
                        -20,
                    ],
                    label: 'Miles',
                    yAxisID: 'y-axis-0',
                    borderColor: '#EF9A9A',
                    backgroundColor: '#EF9A9A',
                    hoverBackgroundColor: '#E57373',
                    hoverBorderColor: '#E57373',
                    barThickness: 18,
                },
            },
        ],
        showLegend: false,
        chartValues: [150, 257.7, 190, 568.85],
        defaultType: 'bar',
        chartWidth: '417',
        chartHeight: '130',
        dataLabels: [
            '',
            'NOV',
            '',
            '2021',
            '',
            'MAR',
            '',
            'MAY',
            '',
            'JUL',
            '',
            'SEP',
        ],
        onHoverAnnotation: true,
        hoverTimeDisplay: true,
        stacked: true,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        noChartImage: 'assets/svg/common/stacked_no_data.svg',
    };

    public stackedBarChartLegend: any[] = [
        {
            title: 'Avg. Pickup Time',
            value: 68.56,
            image: 'assets/svg/common/round_green.svg',
            customClass: 'light_green',
            sufix: 'm',
            elementId: 0,
        },
        {
            title: 'Avg. Delivery Time',
            value: 37.56,
            image: 'assets/svg/common/round_blue.svg',
            customClass: 'light_red',
            sufix: 'm',
            elementId: 1,
        },
    ];

    public stackedBarAxes: object = {
        verticalLeftAxes: {
            visible: true,
            minValue: -30,
            maxValue: 30,
            stepSize: 15,
            showGridLines: true,
        },
        horizontalAxes: {
            visible: true,
            position: 'bottom',
            showGridLines: false,
        },
    };

    constructor(
        private detailsPageDriverSer: DetailsPageService,
        private shipperMinimalListQuery: ShipperMinimalListQuery
    ) {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.shipper?.currentValue != changes.shipper?.previousValue) {
            this.note.patchValue(changes?.shipper.currentValue.note);
            this.shipper = changes.shipper.currentValue;
            this.getShipperDropdown();
        }
    }
    ngOnInit(): void {
        this.tabsButton();
    }
    public getShipperDropdown() {
        this.shipperDropdowns = this.shipperMinimalListQuery
            .getAll()
            .map((item) => {
                return {
                    id: item.id,
                    name: item.businessName,
                    active: item.id === this.shipper.id,
                };
            });
    }

    public tabsButton() {
        this.shipperTabs = [
            {
                id: 223,
                name: '1M',
            },
            {
                name: '3M',
                checked: false,
            },
            {
                id: 412,
                name: '6M',
                checked: false,
            },
            {
                id: 515,
                name: '1Y',
                checked: false,
            },
            {
                id: 1210,
                name: 'YTD',
                checked: false,
            },
            {
                id: 1011,
                name: 'ALL',
                checked: false,
            },
        ];
    }
    public onSelectedShipper(event: any) {
        if (event.id !== this.shipper.id) {
            this.shipperList = this.shipperMinimalListQuery
                .getAll()
                .map((item) => {
                    return {
                        id: item.id,
                        name: item.businessName,
                        active: item.id === event.id,
                    };
                });
            this.detailsPageDriverSer.getDataDetailId(event.id);
        }
    }

    public onChangeShipper(action: string) {
        let currentIndex = this.shipperList.findIndex(
            (shipper) => shipper.id === this.shipper.id
        );

        switch (action) {
            case 'previous': {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.shipperList[currentIndex].id
                    );
                    this.onSelectedShipper({
                        id: this.shipperList[currentIndex].id,
                    });
                }
                break;
            }
            case 'next': {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.shipperList.length > currentIndex
                ) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.shipperList[currentIndex].id
                    );
                    this.onSelectedShipper({
                        id: this.shipperList[currentIndex].id,
                    });
                }
                break;
            }
            default: {
                break;
            }
        }
    }
}
