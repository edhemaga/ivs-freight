import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
    CreateDispatchCommand,
    DispatchStatus,
    UpdateDispatchCommand,
} from 'appcoretruckassist';
import { catchError, of } from 'rxjs';
import { ColorFinderPipe } from '../../dispatcher/pipes/color-finder.pipe';
import { DispatchBoardLocalResponse } from '../../dispatcher/state/dispatcher.model';
import { DispatcherStoreService } from '../../dispatcher/state/dispatcher.service';
import { TaInputService } from '../../shared/ta-input/ta-input.service';

@Component({
    selector: 'app-dispatch-table',
    templateUrl: './dispatch-table.component.html',
    styleUrls: ['./dispatch-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ColorFinderPipe],
})
export class DispatchTableComponent implements OnInit {
    checkForEmpty: string = '';
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
        console.log(this.dData);
    }

    @Input() dDataIndx: number;

    public selectedColor: any = {};

    openedTruckDropdown: number = -1;
    openedTrailerDropdown: number = -1;
    openedDriverDropdown: number = -1;
    statusOpenedIndex: number = -1;
    showAddAddressField: number = -1;
    savedTruckId: any;

    __isBoardLocked: boolean = true;
    __change_in_proggress: boolean = false;

    @Input() set isBoardLocked(isLocked: boolean) {
        this.__isBoardLocked = isLocked;
    }

    constructor(
        private dss: DispatcherStoreService,
        private chd: ChangeDetectorRef,
        private colorPipe: ColorFinderPipe
    ) {}

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

    addTruck(e) {
        if (e) {
            if (this.openedTruckDropdown == -2) this.savedTruckId = e;
            else this.dData.dispatches[this.openedTruckDropdown].truck = e;
            this.showAddAddressField = this.openedTruckDropdown;
        }

        this.openedTruckDropdown = -1;
    }

    addTrailer(e) {
        if (e) {
            this.updateOrAddDispatchBoardAndSend(
                'trailerId',
                e.id,
                this.openedTrailerDropdown
            );
        }

        this.openedTrailerDropdown = -1;
    }

    handleInputSelect(e: any) {
        if (e.valid) {
            this.updateOrAddDispatchBoardAndSend(
                'location',
                e.address,
                this.showAddAddressField
            );
        }
    }

    onHideDropdown(e) {
        setTimeout(() => {
            if (this.showAddAddressField != -2)
                this.dData.dispatches[this.showAddAddressField].truck = null;
            this.showAddAddressField = -1;
            this.chd.detectChanges();
        }, 200);
    }

    addDriver(e) {
        if (e) {
            const driverOrCoDriver = !this.dData.dispatches[
                this.openedDriverDropdown
            ]?.driver
                ? 'driverId'
                : 'coDriverId';
            this.updateOrAddDispatchBoardAndSend(
                driverOrCoDriver,
                e.id,
                this.openedDriverDropdown
            );
        }

        this.openedDriverDropdown = -1;
    }

    addStatus(e) {
        if (e) {
            if ([7, 8, 9, 4, 10, 6].includes(e.statusValue.id)) {
                this.dData.dispatches[this.statusOpenedIndex].status = e;
                this.showAddAddressField = this.statusOpenedIndex;
            } else {
                this.updateOrAddDispatchBoardAndSend(
                    'status',
                    e.statusValue.name,
                    this.statusOpenedIndex
                );
            }
        }

        this.statusOpenedIndex = -1;
    }

    updateOrAddDispatchBoardAndSend(key, value, index) {
        const oldData = this.dData.dispatches[index]
            ? JSON.parse(JSON.stringify(this.dData.dispatches[index]))
            : {};

        //const dataId = oldData.id;
        let oldUpdateData: CreateDispatchCommand | UpdateDispatchCommand = {
            status: oldData.status
                ? (oldData.status?.statusValue.name as DispatchStatus)
                : 'Off',
            order: oldData.order,
            truckId: oldData.truck ? oldData.truck?.id : null,
            trailerId: oldData.trailer ? oldData.trailer?.id : null,
            driverId: oldData.driver ? oldData.driver?.id : null,
            coDriverId: oldData.coDriver ? oldData.coDriver?.id : null,
            location: oldData.location?.address ? oldData.location : null,
            // hourOfService: 0,
            note: oldData.note,
            loadIds: [],
        };

        let newData: any = {
            ...oldUpdateData,
            [key]: value,
        };

        this.__change_in_proggress = true;

        this.checkForEmpty = key;

        if (oldData.id) {
            newData = {
                id: oldData.id,
                ...newData,
            };

            if (!value && key == 'truckId') newData.location = null;

            this.dss
                .updateDispatchBoard(newData, this.dData.id)
                .pipe(
                    catchError((error) => {
                        this.checkEmptySet = '';
                        return of([]);
                    })
                )
                .subscribe((data) => {
                    this.dss.updateCountList(this.dData.id, key, value);
                    this.dss.updateModalList();
                    this.checkEmptySet = '';
                    this.__change_in_proggress = false;
                });
        } else {
            newData.dispatchBoardId = this.dData.id;

            if (key == 'location') newData.truckId = this.savedTruckId.id;

            this.dss
                .createDispatchBoard(newData, this.dData.id)
                .pipe(
                    catchError((error) => {
                        this.checkEmptySet = '';
                        return of([]);
                    })
                )
                .subscribe((data) => {
                    this.checkEmptySet = '';
                    this.dss.updateCountList(this.dData.id, key, value);
                    this.dss.updateModalList();
                    this.__change_in_proggress = false;
                });
        }
    }

    set checkEmptySet(value) {
        setTimeout(() => {
            this.checkForEmpty = value;
            this.chd.detectChanges();
        }, 300);
    }
}
