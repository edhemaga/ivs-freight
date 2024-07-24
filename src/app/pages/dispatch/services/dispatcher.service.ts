import { Injectable } from '@angular/core';
import { flatMap, delay, of, map, BehaviorSubject } from 'rxjs';

// Store
import { DispatcherStore } from '@pages/dispatch/state/dispatcher.store';

// Models
import {
    CreateDispatchCommand,
    DispatchBoardListResponse,
    DispatchBoardResponse,
    DispatchService,
    DriverService,
    ReorderDispatchesCommand,
    SwitchDispatchesCommand,
    UpdateDispatchCommand,
} from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class DispatcherService {
    public parkingOpened: boolean = false;
    public newParkingSubject = new BehaviorSubject<boolean>(false);

    constructor(
        private dispatcherStore: DispatcherStore,
        private dispatchService: DispatchService,
        private driverService: DriverService
    ) {}
    getDispatcherList() {
        return this.dispatchService.apiDispatchModalGet();
    }

    updateModalList() {
        this.dispatchService.apiDispatchModalGet().subscribe((modal) => {
            this.modalList = modal;
        });
    }

    getDispatchboardList() {
        return this.dispatchService.apiDispatchBoardListGet();
    }

    getDispatchBoardByDispatcherList(id: number) {
        return this.dispatchService.apiDispatchBoardIdGet(id);
    }

    getDispatchboardAllListAndUpdate() {
        this.getDispatchboardList().subscribe(
            (result: DispatchBoardListResponse) => {
                this.dispatchList = result;
            }
        );
    }

    getDispatchBoardByDispatcherListAndUpdate(id: number) {
        this.getDispatchBoardByDispatcherList(id).subscribe(
            (result: DispatchBoardResponse) => {
                this.dispatchByDispatcher = [result];
            }
        );
    }

    getDispatchboardById(id: number) {
        return this.dispatchService.apiDispatchBoardIdGet(id);
    }

    getDispatchBoardRowById(id: number) {
        return this.dispatchService.apiDispatchIdGet(id);
    }

    changeDriverVacation(id: number) {
        return this.driverService.apiDriverVacationIdPatch(id);
    }

    reorderDispatchboard(reorder: ReorderDispatchesCommand) {
        return this.dispatchService.apiDispatchReorderPut(reorder);
    }

    switchDispathboard(swithcData: SwitchDispatchesCommand) {
        return this.dispatchService.apiDispatchSwitchPut(swithcData);
    }

    deleteDispatchboard(id: number) {
        return this.dispatchService.apiDispatchIdDelete(id);
    }

    createDispatchBoard(
        createData: CreateDispatchCommand,
        dispatch_id: number
    ) {
        return this.dispatchService
            .apiDispatchPost(createData)
            .pipe(
                flatMap((params) => {
                    return this.getDispatchBoardRowById(params.id);
                })
            )
            .pipe(
                map((res) => {
                    this.dispatchBoardItem = { id: dispatch_id, item: res };
                })
            );
    }

    updateDispatchboardRowById(id: number, dispatch_id: number) {
        return this.getDispatchBoardRowById(id)
            .pipe(
                flatMap((response) => {
                    if (
                        !response.truck &&
                        !response.trailer &&
                        !response.driver
                    ) {
                        return this.deleteDispatchboard(response.id);
                    }

                    return of(response);
                })
            )
            .pipe(
                delay(300),
                map((res) => {
                    if (res.id)
                        this.dispatchBoardItem = { id: dispatch_id, item: res };
                    else
                        this.dispatchBoardItem = {
                            id: dispatch_id,
                            item: { id: id },
                        };
                })
            );
    }

    updateDispatchBoard(
        updateData: UpdateDispatchCommand,
        dispatch_id: number
    ) {
        return this.dispatchService
            .apiDispatchPut(updateData)
            .pipe(
                flatMap(() => {
                    return this.getDispatchBoardRowById(updateData.id).pipe(
                        flatMap((response) => {
                            if (
                                !response.truck &&
                                !response.trailer &&
                                !response.driver
                            ) {
                                return this.deleteDispatchboard(response.id);
                            }

                            return of(response);
                        })
                    );
                })
            )
            .pipe(
                delay(300),
                map((res) => {
                    if (res.id)
                        this.dispatchBoardItem = { id: dispatch_id, item: res };
                    else
                        this.dispatchBoardItem = {
                            id: dispatch_id,
                            item: { id: updateData.id },
                        };
                })
            );
    }

    set dispatchBoardItem(boardData) {
        const dss = this.dispatcherStore.getValue();
        const dispatchData = JSON.parse(JSON.stringify(dss.dispatchList));
        this.dispatcherStore.update((store) => ({
            ...store,
            dispatchList: {
                ...store.dispatchList,
                pagination: {
                    ...store.dispatchList.pagination,
                    data: dispatchData.pagination.data.map((item) => {
                        let findedItem = false;
                        if (item.id == boardData.id) {
                            item.dispatches = item.dispatches
                                .map((data) => {
                                    if (data.id == boardData.item.id) {
                                        findedItem = true;
                                        data = { ...boardData.item };
                                    }

                                    return data;
                                })
                                .filter(
                                    (data) =>
                                        data.truck ||
                                        data.trailer ||
                                        data.driver
                                );

                            if (!findedItem) {
                                item.dispatches.push({ ...boardData.item });
                            }
                        }
                        return item;
                    }),
                },
            },
        }));
    }

    set modalList(modal) {
        this.dispatcherStore.update((store) => ({
            ...store,
            modal,
        }));
    }

    set dispatchList(dispatchList) {
        this.dispatcherStore.update((store) => ({
            ...store,
            dispatchList,
        }));
    }

    set dispatchByDispatcher(dispatch) {
        this.dispatcherStore.update((store) => ({
            ...store,
            dispatchList: {
                ...store.dispatchList,
                pagination: {
                    ...store.dispatchList.pagination,
                    data: dispatch,
                },
            },
        }));
    }

    set dispatcherData(list) {
        this.dispatcherStore.update((store) => ({
            ...store,
            modal: list[0],
            dispatchList: list[1],
        }));
    }

    async updateCountList<T>(id: number, type: string, value: T) {
        const dss = await this.dispatcherStore.getValue();
        const dispatchData = JSON.parse(JSON.stringify(dss.dispatchList));

        this.dispatcherStore.update((store) => ({
            ...store,
            dispatchList: {
                ...store.dispatchList,
                pagination: {
                    ...store.dispatchList.pagination,
                    data: dispatchData.pagination.data.map((item) => {
                        if (item.id == id) {
                            switch (type) {
                                case 'trailerId':
                                    item.trailerCount += value ? 1 : -1;
                                    break;
                                case 'location':
                                    item.truckCount += value ? 1 : -1;
                                    break;
                                case 'driverId':
                                    item.driverCount += value ? 1 : -1;
                                    break;
                                default:
                            }
                        }

                        return item;
                    }),
                },
            },
        }));
    }
}
