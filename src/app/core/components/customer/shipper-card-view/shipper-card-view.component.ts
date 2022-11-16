import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
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
    @Input() shipper: any;
    @Input() templateCard: boolean;
    public shipperDropdowns: any[] = [];
    public shipperList: any[] = this.shipperMinimalListQuery.getAll();
    public note: FormControl = new FormControl();
    public shipperTabs: any[] = [];
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
