import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';

import { catchError, of } from 'rxjs';

// modules
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Options } from 'ng5-slider';

// pipes
import { ColorFinderPipe } from '@pages/dispatch/pipes/color-finder.pipe';

// services
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';
import { ModalService } from '@shared/services/modal.service';

// components
import { DriverModalComponent } from '@pages/driver/pages/driver-modals/driver-modal/driver-modal.component';
import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';

// models
import {
    CreateDispatchCommand,
    DispatchStatus,
    SwitchDispatchCommand,
    UpdateDispatchCommand,
} from 'appcoretruckassist';
import { DispatchBoardLocalResponse } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/dispatcher.model';

@Component({
    selector: 'app-dispatch-table',
    templateUrl: './dispatch-table.component.html',
    styleUrls: ['./dispatch-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ColorFinderPipe],
    animations: [
        trigger('iconAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('100ms', style({ opacity: '*' })),
            ]),
            transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
        ]),
    ],
})
export class DispatchTableComponent implements OnInit {
    /////////////////////////////////////////// UPDATE

    checkForEmpty: string = '';
    dData: DispatchBoardLocalResponse = {};
    truckFormControll: UntypedFormControl = new UntypedFormControl();
    truckAddress: UntypedFormControl = new UntypedFormControl(null);
    truckList: any[];
    trailerList: any[];
    driverList: any[];
    copyIndex: number = -1;
    testTimeout: any;
    startIndexTrailer: number;
    startIndexDriver: number;
    savedTruckData: any = null;
    draggingType: string = '';

    @Input() set smallList(value) {
        const newTruckList = JSON.parse(JSON.stringify(value.trucks));
        this.truckList = newTruckList.map((item) => {
            item.name = item.truckNumber;
            item.code = this.colorPipe.transform(item.truckType.id, 'truck');
            item.folder = 'common';
            item.subFolder = 'colors';
            item.logoName = 'ic_circle.svg';
            return item;
        });
        const newTrailerList = JSON.parse(JSON.stringify(value.trailers));
        this.trailerList = newTrailerList.map((item) => {
            item.name = item.trailerNumber;
            item.code = this.colorPipe.transform(
                item.trailerType.id,
                'trailer'
            );
            item.folder = 'common';
            item.subFolder = 'colors';
            item.logoName = 'ic_circle.svg';
            return item;
        });
        const driversList = JSON.parse(JSON.stringify(value.drivers));
        this.driverList = driversList.map((item) => {
            item.name = `${item.firstName} ${item.lastName}`;
            item.svg = item.owner ? 'ic_owner-status.svg' : null;
            item.folder = 'common';
            return item;
        });
    }

    @Input() set _dData(value) {
        this.dData = JSON.parse(JSON.stringify(value));

        console.log(' this.dData.dispatches', this.dData.dispatches);

        this.dData.dispatches = this.dData.dispatches.map((item) => {
            let i = 0;
            item.hoursOfService = item.hoursOfService
                .sort((a, b): number => {
                    return a.id < b.id ? -1 : 0;
                })
                .map((it) => {
                    it.indx = i;
                    i++;
                    return it;
                });

            return item;
        });
    }

    @Input() dDataIndx: number;
    @Input() toolbarWidth: number = 0;

    public selectedColor: any = {};

    openParkingDropdown: number = -1;
    openedTrailerDropdown: number = -1;
    openedDriverDropdown: number = -1;
    statusOpenedIndex: number = -1;
    showAddAddressField: number = -1;
    savedTruckId: any;

    driverHover: { indx: number; txt: string } = {
        indx: -1,
        txt: '',
    };
    driverCopy: { indx: number; txt: string } = {
        indx: -1,
        txt: '',
    };

    __isBoardLocked: boolean = true;
    __change_in_proggress: boolean = false;

    @Input() set isBoardLocked(isLocked: boolean) {
        this.__isBoardLocked = isLocked;
    }

    hosHelper = [];

    openedHosData = [];

    tooltip: any;

    parking: any[] = [
        {
            id: 1,
            name: '2334',
        },
        {
            id: 2,
            name: '5555',
        },
    ];

    options: Options = {
        floor: 0,
        ceil: 1440,
        showSelectionBar: false,
        noSwitching: true,
        hideLimitLabels: true,
        animate: false,
        maxLimit: new Date().getHours() * 60 + new Date().getMinutes(),
    };

    isDrag: boolean = false;

    constructor(
        private chd: ChangeDetectorRef,

        // Pipes
        private colorPipe: ColorFinderPipe,

        // Services
        private dispatcherService: DispatcherService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {}

    public handleRemoveTruckClick(event: { type: string; index: number }) {
        this.updateOrAddDispatchBoardAndSend(event.type, null, event.index);
    }

    /////////////////////////////////////////// UPDATE

    showParkingDropdown(ind: number) {
        this.openParkingDropdown = ind;
    }

    showTrailerDropdown(ind: number) {
        this.openedTrailerDropdown = ind;
    }

    showDriverDropdown(ind: number) {
        this.openedDriverDropdown = ind;
    }

    addTrailer(e) {
        if (e) {
            if (e.canOpenModal) {
                this.modalService.setProjectionModal({
                    action: 'open',
                    payload: {
                        key: 'truck-modal', // kljuc moze i ne mora, moze null
                        value: null,
                    },
                    component: TrailerModalComponent, // naziv komponente modala koji se otvara
                    size: 'small',
                });
            } else {
                this.updateOrAddDispatchBoardAndSend(
                    'trailerId',
                    e.id,
                    this.openedTrailerDropdown
                );
            }
        }

        this.openedTrailerDropdown = -1;
    }

    addParking() {
        this.openParkingDropdown = -1;
    }

    handleInputSelect(e: any) {
        // return;
        if (e.valid) {
            this.updateOrAddDispatchBoardAndSend(
                'location',
                e.address,
                this.showAddAddressField
            );
        }
    }

    onHideDropdown() {
        setTimeout(() => {
            if (this.showAddAddressField != -2)
                this.dData.dispatches[this.showAddAddressField].truck =
                    this.savedTruckData;
            this.showAddAddressField = -1;
            this.savedTruckData = null;
            this.chd.detectChanges();
        }, 3000);
    }

    addDriver(e) {
        if (e) {
            if (e.canOpenModal) {
                this.modalService.setProjectionModal({
                    action: 'open',
                    payload: {
                        key: 'truck-modal', // kljuc moze i ne mora, moze null
                        value: null,
                    },
                    component: DriverModalComponent, // naziv komponente modala koji se otvara
                    size: 'small',
                });
            } else {
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
        }

        this.openedDriverDropdown = -1;
    }

    addStatus(e) {
        if (e) {
            if ([7, 8, 9, 4, 10, 6].includes(e.statusValue.id)) {
                this.dData.dispatches[this.statusOpenedIndex].status = e;
                this.showAddAddressField = this.statusOpenedIndex;
                this.savedTruckData =
                    this.dData.dispatches[this.statusOpenedIndex].truck;
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
            // hoursOfService: 0,
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

            this.dispatcherService
                .updateDispatchBoard(newData, this.dData.id)
                .pipe(
                    catchError(() => {
                        this.checkEmptySet = '';
                        this.__change_in_proggress = false;
                        return of([]);
                    })
                )
                .subscribe(() => {
                    this.dispatcherService.updateCountList(
                        this.dData.id,
                        key,
                        value
                    );
                    this.dispatcherService.updateModalList();
                    this.checkEmptySet = '';
                    this.__change_in_proggress = false;
                });
        } else {
            newData.dispatchBoardId = this.dData.id;

            if (key == 'location') newData.truckId = this.savedTruckId.id;

            this.dispatcherService
                .createDispatchBoard(newData, this.dData.id)
                .pipe(
                    catchError(() => {
                        this.checkEmptySet = '';
                        this.__change_in_proggress = false;
                        return of([]);
                    })
                )
                .subscribe(() => {
                    this.checkEmptySet = '';
                    this.dispatcherService.updateCountList(
                        this.dData.id,
                        key,
                        value
                    );
                    this.dispatcherService.updateModalList();
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

    public copy(text: string, indx: number, type: string): void {
        this.driverCopy = {
            indx: indx,
            txt: type,
        };
        this.copyIndex = indx;

        setTimeout(() => {
            this.driverCopy = {
                indx: -1,
                txt: '',
            };
            this.copyIndex = -1;
            this.chd.detectChanges();
        }, 2000);

        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    setMouseOver(txt: string, indx: number) {
        this.driverHover = {
            indx: indx,
            txt: txt,
        };
    }

    setMouseOut() {
        this.driverHover = {
            indx: -1,
            txt: '',
        };
    }

    toggleHos(tooltip: NgbTooltip, data: any) {
        this.hosHelper = [];
        if (!data || data.length === 0) {
            data = [
                {
                    start: 0,
                    end: new Date().getHours() * 60 + new Date().getMinutes(),
                    flag: 'off',
                    indx: 0,
                },
            ];
        }

        this.tooltip = tooltip;

        this.openedHosData = data;

        if (tooltip.isOpen()) {
            tooltip.close();
        } else {
            tooltip.open();
        }
    }

    saveHosData(hos, indx) {
        this.openedHosData = this.openedHosData.map((item) => {
            item.flag = item.flag?.name ? item.flag.name : item.flag;
            return item;
        });

        this.updateOrAddDispatchBoardAndSend(
            'hoursOfService',
            this.openedHosData,
            indx
        );
    }

    userChangeEnd(event, item) {
        const index = item.indx;
        const nextHos = index + 1;
        if (this.openedHosData[nextHos]) {
            clearTimeout(this.testTimeout);
            this.testTimeout = setTimeout(() => {
                this.changeHosDataPositions(event, index);
            }, 0);
        }
    }

    changeHosDataPositions(event, index) {
        const nextHos = index + 1;
        if (this.openedHosData[nextHos]) {
            this.openedHosData[nextHos].start = this.openedHosData[index].end;
        }
    }

    addHOS(hosType) {
        this.openedHosData = [...this.openedHosData];
        this.openedHosData.push({
            start: this.openedHosData[this.openedHosData.length - 1].end,
            end: new Date().getHours() * 60 + new Date().getMinutes(),
            flag: { name: hosType },
            indx: this.openedHosData.length,
        });
    }

    removeHos(item) {
        this.openedHosData = this.openedHosData.filter(
            (it) => it.indx !== item.indx
        );
    }

    saveNoteValue(item: any) {
        this.updateOrAddDispatchBoardAndSend(
            'note',
            item.note,
            item.dispatchIndex
        );
    }

    openIndex(indx: number) {
        this.statusOpenedIndex = indx;
    }

    changeDriverVacation(data) {
        this.__change_in_proggress = true;

        this.dispatcherService
            .changeDriverVacation(data.driver.id)
            .subscribe(() => {
                this.dispatcherService
                    .updateDispatchboardRowById(data.id, this.dData.id)
                    .subscribe(() => {
                        this.__change_in_proggress = false;
                    });
            });
    }

    removeTrailer(indx) {
        this.updateOrAddDispatchBoardAndSend('trailerId', null, indx);
    }

    removeDriver(indx) {
        this.updateOrAddDispatchBoardAndSend('driverId', null, indx);
    }

    // CDL DRAG AND DROP

    dropList(event) {
        this.__change_in_proggress = true;

        this.dispatcherService
            .reorderDispatchboard({
                dispatchBoardId: this.dData.id,
                dispatches: [
                    {
                        id: this.dData.dispatches[event.currentIndex].id,
                        order: this.dData.dispatches[event.previousIndex].order,
                    },
                    {
                        id: this.dData.dispatches[event.previousIndex].id,
                        order: this.dData.dispatches[event.currentIndex].order,
                    },
                ],
            })
            .pipe(
                catchError(() => {
                    this.checkEmptySet = '';
                    this.__change_in_proggress = false;
                    return of([]);
                })
            )
            .subscribe(() => {
                this.dData.dispatches[event.currentIndex].order =
                    this.dData.dispatches[event.previousIndex].order;
                this.dData.dispatches[event.previousIndex].order =
                    this.dData.dispatches[event.currentIndex].order;
                this.__change_in_proggress = false;
                this.chd.detectChanges();
            });

        moveItemInArray(
            this.dData.dispatches,
            event.previousIndex,
            event.currentIndex
        );
    }

    dropTrailer(event, finalIndx) {
        if (finalIndx === this.startIndexTrailer) return;
        if (finalIndx == -1) return; // TODO
        const finalIndexData = this.getDataForUpdate(
            this.dData.dispatches[finalIndx]
        );
        const startingIndexData = this.getDataForUpdate(
            this.dData.dispatches[this.startIndexTrailer]
        );

        this.__change_in_proggress = true;
        this.dispatcherService
            .switchDispathboard({
                dispatchBoardId: this.dData.id,
                firstDispatch: {
                    ...startingIndexData,
                    id: this.dData.dispatches[this.startIndexTrailer].id,
                    trailerId: this.dData.dispatches[finalIndx]?.trailer?.id,
                },
                secondDispatch: {
                    ...finalIndexData,
                    id: this.dData.dispatches[finalIndx].id,
                    trailerId:
                        this.dData.dispatches[this.startIndexTrailer]?.trailer
                            ?.id,
                },
            })
            .subscribe(() => {
                this.dispatcherService
                    .updateDispatchboardRowById(
                        this.dData.dispatches[this.startIndexTrailer].id,
                        this.dData.id
                    )
                    .subscribe(() => {
                        this.__change_in_proggress = false;
                    });
                this.dispatcherService
                    .updateDispatchboardRowById(
                        this.dData.dispatches[finalIndx].id,
                        this.dData.id
                    )
                    .subscribe(() => {
                        this.__change_in_proggress = false;
                    });
            });
    }

    dropDriver(event, finalIndx) {
        if (finalIndx === this.startIndexDriver) return;
        if (finalIndx == -1) return; // Todo
        const finalIndexData = this.getDataForUpdate(
            this.dData.dispatches[finalIndx]
        );
        const startingIndexData = this.getDataForUpdate(
            this.dData.dispatches[this.startIndexDriver]
        );

        this.__change_in_proggress = true;
        this.dispatcherService
            .switchDispathboard({
                dispatchBoardId: this.dData.id,
                firstDispatch: {
                    ...startingIndexData,
                    id: this.dData.dispatches[this.startIndexDriver].id,
                    driverId: this.dData.dispatches[finalIndx]?.driver?.id,
                },
                secondDispatch: {
                    ...finalIndexData,
                    id: this.dData.dispatches[finalIndx].id,
                    driverId:
                        this.dData.dispatches[this.startIndexDriver]?.driver
                            ?.id,
                },
            })
            .subscribe(() => {
                this.dispatcherService
                    .updateDispatchboardRowById(
                        this.dData.dispatches[this.startIndexDriver].id,
                        this.dData.id
                    )
                    .subscribe(() => {
                        this.__change_in_proggress = false;
                    });
                this.dispatcherService
                    .updateDispatchboardRowById(
                        this.dData.dispatches[finalIndx].id,
                        this.dData.id
                    )
                    .subscribe(() => {
                        this.__change_in_proggress = false;
                    });
            });
    }

    getDataForUpdate(oldData): SwitchDispatchCommand {
        return {
            truckId: oldData.truck ? oldData.truck?.id : null,
            trailerId: oldData.trailer ? oldData.trailer?.id : null,
            driverId: oldData.driver ? oldData.driver?.id : null,
            coDriverId: oldData.coDriver ? oldData.coDriver?.id : null,
            location: oldData.location?.address ? oldData.location : null,
        };
    }

    cdkDragStartedTrailer(event, indx) {
        this.startIndexTrailer = indx;
        this.isDrag = true;
        this.draggingType = 'trailer';
    }

    cdkDragStartedDriver(event, indx) {
        this.startIndexDriver = indx;
        this.isDrag = true;
        this.draggingType = 'driver';
    }

    dragEnd() {
        this.isDrag = false;
        this.draggingType = '';
    }

    showPickupDelivery(popup: any) {
        popup.open();
    }

    // USE ARROW FUNCTION NOTATION TO ACCESS COMPONENT "THIS"
    trailerPositionPrediction = () => {
        return true;
    };

    /////////////////////// UNUSED

    /* 
    public onSelectDropdown(event: any, action: string, test: string) {
        this.selectedColor = event;
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
 */
}
