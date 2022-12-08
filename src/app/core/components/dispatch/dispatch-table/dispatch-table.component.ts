import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColorFinderPipe } from '../../dispatcher/pipes/color-finder.pipe';
import { DispatchBoardLocalResponse } from '../../dispatcher/state/dispatcher.model';
import { TaInputService } from '../../shared/ta-input/ta-input.service';

@Component({
    selector: 'app-dispatch-table',
    templateUrl: './dispatch-table.component.html',
    styleUrls: ['./dispatch-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ColorFinderPipe],
})
export class DispatchTableComponent implements OnInit {
    dData: DispatchBoardLocalResponse = {};
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
        const newTrailerList = JSON.parse(JSON.stringify(value.trailers));
        this.trailerList = newTrailerList.map((item) => {
            item.name = item.trailerNumber;
            item.code = this.colorPipe.transform(
                'trailer',
                item.trailerType.id
            );
            item.folder = 'common';
            item.subFolder = 'colors';
            item.logoName = 'ic_circle.svg';
            return item;
        });
        const driversList = JSON.parse(JSON.stringify(value.drivers));
        this.driverList = driversList.map((item) => {
            item.name = `${item.firstName} ${item.lastName}`;
            return item;
        });
    }

    @Input() set _dData(value) {
        this.dData = JSON.parse(JSON.stringify(value));
    }

    @Input() dDataIndx: number;

    public selectedColor: any = {};

    openedTruckDropdown: number = -1;
    openedTrailerDropdown: number = -1;
    openedDriverDropdown: number = -1;

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

    __isBoardLocked: boolean = true;

    selectTruck: FormControl = new FormControl(null);

    @Input() set isBoardLocked(isLocked: boolean) {
        this.__isBoardLocked = isLocked;
    }

    constructor(private colorPipe: ColorFinderPipe) {}

    ngOnInit(): void {}

    public onSelectDropdown(event: any, action: string, test: string) {
        console.log('WHAT IS EVENT', event, test);
        switch (action) {
            case 'color': {
                this.selectedColor = event;
                break;
            }
        }

        switch (test) {
            case 'truck':
                this.openedTruckDropdown = -1;
                break;
            case 'trailer':
                this.openedTrailerDropdown = -1;
                break;
            case 'driver': 
                this.openedDriverDropdown = -1;
            break;
        }

        this.truckFormControll.reset();
    }

    showTruckDropdown(ind: number) {
        this.openedTruckDropdown = ind;
    }

    showTrailerDropdown(ind: number) {
        this.openedTrailerDropdown = ind;
    }

    showDriverDropdown(ind: number) {
        this.openedDriverDropdown = ind;
    }
}
