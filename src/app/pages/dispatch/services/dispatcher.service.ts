import { Injectable } from '@angular/core';
import {
    mergeMap,
    delay,
    of,
    map,
    BehaviorSubject,
    tap,
    Observable,
} from 'rxjs';

// Store
import { DispatcherStore } from '@pages/dispatch/state/dispatcher.store';

// Models
import {
    CreateDispatchCommand,
    DispatchBoardListResponse,
    DispatchBoardResponse,
    DispatchHistoryGroupListResponse,
    DispatchHistoryListResponse,
    DispatchHistoryModalResponse,
    DispatchService,
    DriverService,
    ReorderDispatchesCommand,
    ReorderDispatchLoadsCommand,
    SwitchDispatchesCommand,
    UpdateDispatchCommand,
    UpdateDispatchStatusCommand,
    DispatchPossibleStatusResponse,
} from 'appcoretruckassist';
import { GetDispatchHistoryData } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/get-dispatch-history-data.model';

@Injectable({ providedIn: 'root' })
export class DispatcherService {
    public parkingOpened: boolean = false;
    public newParkingSubject = new BehaviorSubject<boolean>(false);

    private mainBoardColumnExpandedWidths: BehaviorSubject<{
        isTruckExpanded: boolean;
        isTrailerExpanded: boolean;
        isParkingExpanded: boolean;
    }> = new BehaviorSubject({
        isTruckExpanded: false,
        isTrailerExpanded: false,
        isParkingExpanded: false,
    });

    public mainBoardColumnsExpanded$: Observable<{
        isTruckExpanded: boolean;
        isTrailerExpanded: boolean;
        isParkingExpanded: boolean;
    }> = this.mainBoardColumnExpandedWidths.asObservable();

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

    public getDispatchBoardFilterList(
        dispatcherId?: number,
        teamBoard?: number,
        truckTypes?: Array<number>,
        trailerTypes?: Array<number>,
        statuses?: Array<number>,
        parkings?: Array<number>
    ): Observable<DispatchBoardListResponse> {
        return this.dispatchService.apiDispatchBoardListGet(
            dispatcherId,
            teamBoard,
            truckTypes,
            trailerTypes,
            statuses,
            parkings
        );
    }

    getDispatchBoardByDispatcherList(id: number) {
        return this.dispatchService.apiDispatchBoardGet(id);
    }
    public apiDispatchNextstatusesIdGet(
        id: number
    ): Observable<DispatchPossibleStatusResponse> {
        return this.dispatchService.apiDispatchNextstatusesIdGet(id);
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

    getDispatchBoardRowById(id: number) {
        return this.dispatchService.apiDispatchIdGet(id);
    }

    changeDriverVacation(id: number) {
        return this.driverService.apiDriverVacationIdPatch(id);
    }

    public updatePreTripInspection(id: number): Observable<number> {
        return this.dispatchService.apiDispatchPreTripInspectionPatch({ id });
    }

    public updateDispatchStatus(
        data: UpdateDispatchStatusCommand
    ): Observable<number> {
        return this.dispatchService.apiDispatchStatusPut(data);
    }

    reorderDispatchboard(reorder: ReorderDispatchesCommand) {
        return this.dispatchService.apiDispatchReorderPut(reorder);
    }

    switchDispathboard(swithcData: SwitchDispatchesCommand) {
        return this.dispatchService.apiDispatchSwitchPut(swithcData);
    }

    deleteDispatchboard(dispatchId: number) {
        return this.dispatchService.apiDispatchIdDelete(dispatchId).pipe(
            tap(() => {
                this.dispatcherStore.update((store) => {
                    return {
                        ...store,
                        dispatchList: {
                            ...store.dispatchList.dispatchBoards,
                            dispatchBoards:
                                store.dispatchList.dispatchBoards.map(
                                    (dispatchData) => {
                                        return {
                                            ...dispatchData,
                                            dispatches:
                                                dispatchData.dispatches.filter(
                                                    (dispatch) =>
                                                        dispatch.id !==
                                                        dispatchId
                                                ),
                                        };
                                    }
                                ),
                        },
                    };
                });
            })
        );
    }

    createDispatchBoard(
        createData: CreateDispatchCommand,
        dispatch_id: number
    ) {
        return this.dispatchService
            .apiDispatchPost(createData)
            .pipe(
                mergeMap((params) => {
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
                mergeMap((response) => {
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
                mergeMap(() => {
                    return this.getDispatchBoardRowById(updateData.id).pipe(
                        mergeMap((response) => {
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
        const dispatchData = JSON.parse(
            JSON.stringify(dss.dispatchList.dispatchBoards)
        );

        this.dispatcherStore.update((store) => ({
            ...store,
            dispatchList: {
                ...store.dispatchList,
                dispatchBoards: dispatchData.map((item) => {
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
                                    data.truck || data.trailer || data.driver
                            );

                        if (!findedItem) {
                            item.dispatches.push({ ...boardData.item });
                        }
                    }
                    return item;
                }),
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
                dispatchBoards: dispatch,
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
        const dispatchData = JSON.parse(
            JSON.stringify(dss.dispatchList.dispatchBoards)
        );

        this.dispatcherStore.update((store) => ({
            ...store,

            dispatchList: {
                ...store.dispatchList.dispatchBoards,
                dispatchBoards: dispatchData.map((item) => {
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
        }));
    }

    public getDispatchHistoryModalDropdownLists(): Observable<DispatchHistoryModalResponse> {
        return this.dispatchService.apiDispatchBoardHistoryModalGet();
    }

    public getDispatchHistory(
        data: GetDispatchHistoryData
    ): Observable<DispatchHistoryListResponse> {
        const {
            dispatchBoardId,
            dispatchHistoryTime,
            truckId,
            trailerId,
            driverId,
            customDateFrom,
            customDateTo,
        } = data;

        return this.dispatchService.apiDispatchBoardHistoryGet(
            dispatchBoardId,
            dispatchHistoryTime,
            truckId,
            trailerId,
            driverId,
            null,
            customDateFrom,
            customDateTo
        );
    }

    public getDispatchHistoryGroups(
        data: GetDispatchHistoryData
    ): Observable<DispatchHistoryGroupListResponse> {
        const {
            dispatchBoardId,
            dispatchHistoryTime,
            truckId,
            trailerId,
            driverId,
            customDateFrom,
            customDateTo,
        } = data;

        return this.dispatchService.apiDispatchBoardHistoryGroupsGet(
            dispatchBoardId,
            dispatchHistoryTime,
            truckId,
            trailerId,
            driverId,
            null,
            customDateFrom,
            customDateTo
        );
    }

    public saveDispatchLoads(loads: ReorderDispatchLoadsCommand) {
        return this.dispatchService.apiDispatchReorderLoadsPut(loads);
    }

    public updateMainBoardColumnWidths(
        isTruckExpanded: boolean,
        isTrailerExpanded: boolean,
        isParkingExpanded: boolean
    ): void {
        this.mainBoardColumnExpandedWidths.next({
            isTruckExpanded,
            isTrailerExpanded,
            isParkingExpanded,
        });
    }
}
