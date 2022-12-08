import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColorFinderPipe } from '../../dispatcher/pipes/color-finder.pipe';

@Component({
    selector: 'app-dispatch-table',
    templateUrl: './dispatch-table.component.html',
    styleUrls: ['./dispatch-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ColorFinderPipe],
})
export class DispatchTableComponent implements OnInit {
    truckFormControll: FormControl = new FormControl();
    truckList: any[];
    trailerList: any[];
    driverList: any[];
    @Input() set smallList(value) {
        const newTruckList = JSON.parse(JSON.stringify(value.trucks));
        this.truckList = newTruckList.map((item) => {
            item.name = item.truckNumber;
            item.code = this.colorPipe.transform('truck', item.truckType.id);
            item.folder = 'common';
            item.subFolder = 'colors';
            item.logoName = 'ic_circle.svg';
            return item;
        });
        // const newTrailerList = JSON.parse(JSON.stringify(value.trailers));
        // this.trailerList = newTrailerList.map((item) => {
        //     item.name = item.trailerNumber;
        //     item.colorD = this.colorPipe.transform(
        //         'trailer',
        //         item.trailerType.id
        //     );
        //     return item;
        // });
        // const driversList = JSON.parse(JSON.stringify(value.drivers));
        // this.driverList = driversList.map((item) => {
        //     item.name = `${item.firstName} ${item.lastName}`;
        //     return item;
        // });
    }

    public selectedColor: any = {};

    openedTruckDropdown: number = -1;

    data: any[] = [
        {
            add_new_truck: true,
            add_new_driver: true,
        },
        {
            add_new_trailer: true,
            active_new_truck: true,
        },
        {
            add_new_truck: true,
            add_new_trailer: true,
        },
        {
            add_new_truck: true,
        },
        {
            add_new_trailer: true,
            add_new_driver: true,
        },
        {
            add_new_truck: true,
        },
        {
            add_new_trailer: true,
            add_new_driver: true,
        },
    ];

    constructor(private colorPipe: ColorFinderPipe) {}

    ngOnInit(): void {}

    public onSelectDropdown(event: any, action: string) {
        console.log("WHAT IS EVENT");
        this.openedTruckDropdown = -1;
        this.truckFormControll.reset();
        switch (action) {
            case 'color': {
                this.selectedColor = event;
                break;
            }
        }
    }

    showDropdown(ind: number) {
        this.openedTruckDropdown = ind;
    }
}
