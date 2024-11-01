import { Injectable } from '@angular/core';

import { Observable, Subject, forkJoin, tap, catchError, of } from 'rxjs';

// services
import { FormDataService } from '@shared/services/form-data.service';

// enum
import { TableStringEnum } from '@shared/enums/table-string.enum';

// store
import { LoadDetailsListStore } from '@pages/load/state/load-details-state/load-details-list-state/load-details-list.store';
import { LoadItemStore } from '@pages/load/state/load-details-state/load-details.store';
import { LoadMinimalListStore } from '@pages/load/state/load-details-state/load-minimal-list-state/load-details-minimal.store';
import { LoadActiveStore } from '@pages/load/state/load-active-state/load-active.store';
import {
    LoadPandingState,
    LoadPendingStore,
} from '@pages/load/state/load-pending-state/load-pending.store';
import { LoadClosedStore } from '@pages/load/state/load-closed-state/load-closed.store';
import { LoadTemplateStore } from '@pages/load/state/load-template-state/load-template.store';
import { LoadActiveQuery } from '@pages/load/state/load-active-state/load-active.query';
import { LoadPendingQuery } from '@pages/load/state/load-pending-state/load-pending.query';
import { LoadTemplateQuery } from '@pages/load/state/load-template-state/load-template.query';
import { LoadClosedQuery } from '@pages/load/state/load-closed-state/load-closed.query';

// models
import {
    CreateResponse,
    LoadListResponse,
    LoadService as LoadBackendService,
    LoadTemplateListResponse,
    LoadTemplateResponse,
    LoadResponse,
    LoadMinimalListResponse,
    LoadModalResponse,
    LoadStopItemAutocompleteDescriptionResponse,
    CreateWithUploadsResponse,
    RoutingService,
    RoutingResponse,
    CreateLoadTemplateCommand,
    LoadStatusType,
    DispatcherFilterResponse,
    LoadStatus,
    LoadListLoadStopResponse,
    LoadPossibleStatusesResponse,
    AssignLoadModalResponse,
    AssignedLoadListResponse,
    SortOrder,
    LoadSortBy,
    AddressResponse,
} from 'appcoretruckassist';
import {
    Comment,
    DeleteComment,
} from '@shared/models/card-models/card-table-data.model';
import { Load } from '@pages/load/models/load.model';
import { FilterOptionsLoad } from '@pages/load/pages/load-table/models/filter-options-load.model';

@Injectable({
    providedIn: 'root',
})
export class LoadService {
    private newComment: Subject<Comment> = new Subject<Comment>();
    public data$: Observable<Comment> = this.newComment.asObservable();
    private modalAction: Subject<boolean> = new Subject<null>();
    public modalAction$: Observable<boolean> = this.modalAction.asObservable();

    private statusAction: Subject<{
        dataBack: LoadStatus;
        dataFront: LoadStatus;
        id: number;
    }> = new Subject<{
        dataBack: LoadStatus;
        dataFront: LoadStatus;
        id: number;
    }>();
    public statusAction$: Observable<{
        dataBack: LoadStatus;
        dataFront: LoadStatus;
        id: number;
        isRevert?: boolean;
    }> = this.statusAction.asObservable();

    private deleteComment: Subject<DeleteComment> =
        new Subject<DeleteComment>();
    public removeComment$: Observable<Comment> =
        this.deleteComment.asObservable();

    constructor(
        private loadService: LoadBackendService,
        private formDataService: FormDataService,
        private routingService: RoutingService,

        // store
        private loadDetailsListStore: LoadDetailsListStore,
        private loadItemStore: LoadItemStore,
        private loadMinimalListStore: LoadMinimalListStore,
        private loadActiveStore: LoadActiveStore,
        private loadPendingStore: LoadPendingStore,
        private loadClosedStore: LoadClosedStore,
        private loadTemplateStore: LoadTemplateStore,
        private loadActiveQuery: LoadActiveQuery,
        private loadPendingQuery: LoadPendingQuery,
        private loadTemplateQuery: LoadTemplateQuery,
        private loadClosedQuery: LoadClosedQuery
    ) {}

    public addData(data: Comment): void {
        this.newComment.next(data);
    }

    public removeComment(comment: DeleteComment): void {
        this.deleteComment.next(comment);
    }
    public updateStatus(data: {
        dataBack: LoadStatus;
        dataFront: LoadStatus;
        id: number;
        isRevert: boolean;
    }) {
        this.statusAction.next(data);
    }

    private getOrderAndSort(sortString: string): {
        sortBy: LoadSortBy;
        order: SortOrder;
    } {
        let order = null;
        let sortBy = null;

        if (sortString?.endsWith('Asc')) {
            order = SortOrder.Ascending;
            sortBy = sortString.replace(/Asc$/, '');
        } else {
            order = SortOrder.Descending;
            sortBy = sortString?.replace(/Desc$/, '');
        }

        return { sortBy: sortBy as LoadSortBy, order };
    }

    // table operations
    public getLoadList(
        loadType?: number,
        statusType?: number, // statusType -> 1 - pending, 2 - active, 3 - closed
        status?: Array<number>,
        dispatcherIds?: Array<number>,
        dispatcherId?: number,
        dispatchId?: number,
        brokerId?: number,
        shipperId?: number,
        loadId?: number,
        dateFrom?: string,
        dateTo?: string,
        revenueFrom?: number,
        revenueTo?: number,
        truckId?: number,
        driverId?: number,
        rateFrom?: number,
        rateTo?: number,
        paidFrom?: number,
        paidTo?: number,
        dueFrom?: number,
        dueTo?: number,
        pickup?: boolean,
        delivery?: boolean,
        longitude?: number,
        latitude?: number,
        distance?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<LoadListResponse> {
        const { order, sortBy } = this.getOrderAndSort(sort);

        return this.loadService.apiLoadListGet(
            loadType,
            statusType,
            status,
            dispatcherIds,
            dispatcherId,
            dispatchId,
            brokerId,
            shipperId,
            loadId,
            dateFrom,
            dateTo,
            revenueFrom,
            revenueTo,
            truckId,
            driverId,
            rateFrom,
            rateTo,
            paidFrom,
            paidTo,
            dueFrom,
            dueTo,
            // pickup,
            // delivery,
            // longitude,
            // latitude,
            // distance,
            // pageIndex,
            // pageSize,
            // companyId,
            null,
            // order,
            // sortBy,
            // search,
            // search1,
            // search2
        );
    }

    public getLoadMinimalList(
        pageIndex?: number,
        pageSize?: number
    ): Observable<LoadMinimalListResponse> {
        return this.loadService.apiLoadListMinimalGet(pageIndex, pageSize);
    }

    public getLoadTemplateList(
        loadType?: number,
        revenueFrom?: number,
        revenueTo?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<LoadTemplateListResponse> {
        return this.loadService.apiLoadTemplateListGet(
            loadType,
            revenueFrom,
            revenueTo,
            null,
            pageIndex,
            pageSize,
            companyId,
            sort,
            null,
            null,
            search,
            search1,
            search2
        );
    }

    public deleteLoadById(
        loadId: number,
        loadStatus: string
    ): Observable<void> {
        return this.loadService.apiLoadIdDelete(loadId).pipe(
            tap(() => {
                const loadCount = JSON.parse(
                    localStorage.getItem(TableStringEnum.LOAD_TABLE_COUNT)
                );

                this.loadDetailsListStore.remove(({ id }) => id === loadId);
                this.loadItemStore.remove(({ id }) => id === loadId);
                this.loadMinimalListStore.remove(({ id }) => id === loadId);

                if (loadStatus === TableStringEnum.ACTIVE) {
                    this.loadActiveStore.remove(({ id }) => id === loadId);

                    loadCount.activeCount--;
                } else if (loadStatus === TableStringEnum.CLOSED) {
                    this.loadClosedStore.remove(({ id }) => id === loadId);

                    loadCount.closedCount--;
                } else if (loadStatus === TableStringEnum.PENDING) {
                    this.loadPendingStore.remove(({ id }) => id === loadId);

                    loadCount.pendingCount--;
                }

                localStorage.setItem(
                    TableStringEnum.LOAD_TABLE_COUNT,
                    JSON.stringify({
                        activeCount: loadCount.activeCount,
                        closedCount: loadCount.closedCount,
                        pendingCount: loadCount.pendingCount,
                        templateCount: loadCount.templateCount,
                    })
                );
            })
        );
    }

    public deleteLoadList(
        loadIds: number[],
        loadStatus: string
    ): Observable<any> {
        const requestsArray = loadIds.map((loadId) => {
            return this.loadService.apiLoadIdDelete(loadId);
        });

        return forkJoin([...requestsArray]).pipe(
            tap(([res]) => {
                const loadCount = JSON.parse(
                    localStorage.getItem(TableStringEnum.LOAD_TABLE_COUNT)
                );

                loadIds.forEach((loadId) => {
                    this.loadDetailsListStore.remove(({ id }) => id === loadId);
                    this.loadItemStore.remove(({ id }) => id === loadId);
                    this.loadMinimalListStore.remove(({ id }) => id === loadId);

                    if (loadStatus === TableStringEnum.ACTIVE) {
                        this.loadActiveStore.remove(({ id }) => id === loadId);

                        loadCount.activeCount--;
                    } else if (loadStatus === TableStringEnum.CLOSED) {
                        this.loadClosedStore.remove(({ id }) => id === loadId);

                        loadCount.closedCount--;
                    } else if (loadStatus === TableStringEnum.PENDING) {
                        this.loadPendingStore.remove(({ id }) => id === loadId);

                        loadCount.pendingCount--;
                    }
                });

                localStorage.setItem(
                    TableStringEnum.LOAD_TABLE_COUNT,
                    JSON.stringify({
                        activeCount: loadCount.activeCount,
                        closedCount: loadCount.closedCount,
                        pendingCount: loadCount.pendingCount,
                        templateCount: loadCount.templateCount,
                    })
                );
            })
        );
    }

    public getLoadById(
        id: number,
        isTemplate?: boolean
    ): Observable<LoadResponse> {
        if (isTemplate) {
            return this.loadService.apiLoadTemplateIdGet(id);
        }

        return this.loadService.apiLoadIdGet(id);
    }

    public getLoadTemplateInsideListById(
        id: number
    ): Observable<LoadListResponse> {
        return this.loadService.apiLoadTemplateListGet(null, null, null, id);
    }

    public getLoadInsideListById(id: number): Observable<LoadListResponse> {
        return this.loadService.apiLoadListGet(
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            id
        );
    }

    public autocompleteLoadByDescription(
        description: string
    ): Observable<LoadStopItemAutocompleteDescriptionResponse> {
        return this.loadService.apiLoadStopsAutocompleteDescriptionDescriptionGet(
            description
        );
    }

    // modal operations
    public getLoadDropdowns(
        loadEditId?: number
    ): Observable<LoadModalResponse> {
        return this.loadService.apiLoadModalGet(loadEditId);
    }

    public getLoadListLoadstop(
        loadId: number
    ): Observable<LoadListLoadStopResponse> {
        return this.loadService.apiLoadListLoadstopIdGet(loadId);
    }

    public getRouting(location: string): Observable<RoutingResponse> {
        return this.routingService.apiRoutingGet(location);
    }

    public createLoad(data: Load): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.loadService.apiLoadPost();
    }

    public updateLoad(data: Load): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.loadService.apiLoadPut();
    }

    public updateLoadStatus(
        loadId: number,
        loadStatus: LoadStatus,
        isRevert: boolean,
        newLocation?: AddressResponse
    ): Observable<CreateResponse> {
        if (isRevert) {
            return this.loadService.apiLoadStatusRevertPut({
                id: loadId,
                status: loadStatus,
            });
        } else {
            return this.loadService.apiLoadStatusPut({
                id: loadId,
                status: loadStatus,
                repairLocation: newLocation?.address ?? null,
                longitude: newLocation?.longLat?.longitude ?? null,
                latitude: newLocation?.longLat?.latitude ?? null,
            });
        }
    }

    // modal operations - template
    public createLoadTemplate(
        data: CreateLoadTemplateCommand
    ): Observable<CreateResponse> {
        return this.loadService.apiLoadTemplatePost(data);
    }

    public updateLoadTemplate(
        data: CreateLoadTemplateCommand
    ): Observable<CreateResponse> {
        return this.loadService.apiLoadTemplatePut(data);
    }

    public getLoadTemplateById(id: number): Observable<LoadTemplateResponse> {
        return this.loadService.apiLoadTemplateIdGet(id);
    }
    public deleteLoadTemplateById(loadId: number): Observable<void> {
        return this.loadService.apiLoadTemplateIdDelete(loadId).pipe(
            tap(() => {
                const loadCount = JSON.parse(
                    localStorage.getItem(TableStringEnum.LOAD_TABLE_COUNT)
                );

                this.loadTemplateStore.remove(({ id }) => id === loadId);

                loadCount.templateCount--;

                localStorage.setItem(
                    TableStringEnum.LOAD_TABLE_COUNT,
                    JSON.stringify({
                        activeCount: loadCount.activeCount,
                        closedCount: loadCount.closedCount,
                        pendingCount: loadCount.pendingCount,
                        templateCount: loadCount.templateCount,
                    })
                );
            })
        );
    }

    public deleteLoadTemplateList(loadIds: number[]): Observable<any> {
        const requestsArray = loadIds.map((loadId) => {
            return this.loadService.apiLoadTemplateIdDelete(loadId);
        });

        return forkJoin([...requestsArray]).pipe(
            tap(([res]) => {
                const loadCount = JSON.parse(
                    localStorage.getItem(TableStringEnum.LOAD_TABLE_COUNT)
                );

                loadIds.forEach((loadId) => {
                    this.loadTemplateStore.remove(({ id }) => id === loadId);

                    loadCount.templateCount--;
                });

                localStorage.setItem(
                    TableStringEnum.LOAD_TABLE_COUNT,
                    JSON.stringify({
                        activeCount: loadCount.activeCount,
                        closedCount: loadCount.closedCount,
                        pendingCount: loadCount.pendingCount,
                        templateCount: loadCount.templateCount,
                    })
                );
            })
        );
    }

    public updateLoadTemplatePartily(): void {
        this.triggerModalAction();
    }

    public updateLoadPartily(): void {
        this.triggerModalAction();
    }

    public addNewLoad(): void {
        this.triggerModalAction();
    }

    public triggerModalAction(): void {
        this.modalAction.next(true);
    }

    public getLoadStatusFilter(
        loadStatusType?: LoadStatusType
    ): Observable<DispatcherFilterResponse[]> {
        return this.loadService.apiLoadStatusFilterGet(loadStatusType);
    }

    public getLoadDispatcherFilter(
        loadStatusType?: LoadStatusType
    ): Observable<DispatcherFilterResponse[]> {
        return this.loadService.apiLoadDispatcherFilterGet(loadStatusType);
    }

    public getLoadStatusDropdownOptions(
        id: number
    ): Observable<LoadPossibleStatusesResponse> {
        return this.loadService.apiLoadListStatusIdGet(id);
    }

    public updateNote(data: {
        selectedTab: string;
        id: number;
        value: string;
    }): void {
        let storeLoads;

        switch (data.selectedTab) {
            case TableStringEnum.ACTIVE:
                storeLoads = this.loadActiveQuery.getAll();
                break;
            case TableStringEnum.PENDING:
                storeLoads = this.loadPendingQuery.getAll();
                break;
            case TableStringEnum.TEMPLATE:
                storeLoads = this.loadTemplateQuery.getAll();
                break;
            case TableStringEnum.CLOSED:
                storeLoads = this.loadClosedQuery.getAll();
                break;
            default:
                storeLoads = [];
                break;
        }

        storeLoads.map((load: LoadResponse) => {
            if (data.id === load.id) {
                switch (data.selectedTab) {
                    case TableStringEnum.ACTIVE:
                        this.loadActiveStore.update(load.id, (entity) => ({
                            ...entity,
                            note: data.value,
                        }));
                        break;
                    case TableStringEnum.PENDING:
                        this.loadPendingStore.update(load.id, (entity) => ({
                            ...entity,
                            note: data.value,
                        }));
                        break;
                    case TableStringEnum.TEMPLATE:
                        this.loadTemplateStore.update(load.id, (entity) => ({
                            ...entity,
                            note: data.value,
                        }));
                        break;
                    case TableStringEnum.CLOSED:
                        this.loadClosedStore.update(load.id, (entity) => ({
                            ...entity,
                            note: data.value,
                        }));
                        break;
                }
            }
        });
    }

    public getDispatchModalData(
        isDispatchId: boolean,
        dispatchId?: number,
        truckType?: number[],
        trailerType?: number[],
        _long?: number,
        lat?: number,
        distance?: number,
        dispatchersId?: number[],
        dateFrom?: string,
        dateTo?: string,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<AssignLoadModalResponse | AssignedLoadListResponse> {
        if (isDispatchId) {
            return this.loadService.apiLoadListAssignedIdGet(dispatchId);
        }
        return this.loadService.apiLoadModalAssignGet(
            dispatchId,
            truckType,
            trailerType,
            _long,
            lat,
            distance,
            dispatchersId,
            dateFrom,
            dateTo,
            pageIndex,
            pageSize,
            companyId,
            sort,
            null,
            null,
            search,
            search1,
            search2
        );
    }

    public getPendingData(
        loadType?: number,
        statusType?: number, // statusType -> 1 - pending, 2 - active, 3 - closed
        status?: Array<number>,
        dispatcherIds?: Array<number>,
        dispatcherId?: number,
        dispatchId?: number,
        brokerId?: number,
        shipperId?: number,
        loadId?: number,
        dateFrom?: string,
        dateTo?: string,
        revenueFrom?: number,
        revenueTo?: number,
        truckId?: number,
        driverId?: number,
        rateFrom?: number,
        rateTo?: number,
        paidFrom?: number,
        paidTo?: number,
        dueFrom?: number,
        dueTo?: number,
        pickup?: boolean,
        delivery?: boolean,
        longitude?: number,
        latitude?: number,
        distance?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<LoadPandingState | boolean> {
        return this.getLoadList(
            loadType ?? null,
            1,
            status ?? null,
            dispatcherIds ?? null,
            dispatcherId ?? null,
            dispatchId ?? null,
            brokerId ?? null,
            shipperId ?? null,
            loadId ?? null,
            dateFrom ?? null,
            dateTo ?? null,
            revenueFrom ?? null,
            revenueTo ?? null,
            truckId ?? null,
            driverId ?? null,
            rateFrom ?? null,
            rateTo ?? null,
            paidFrom ?? null,
            paidTo ?? null,
            dueFrom ?? null,
            dueTo ?? null,
            pickup ?? null,
            delivery ?? null,
            longitude ?? null,
            latitude ?? null,
            distance ?? null,
            pageIndex ?? 1,
            pageSize ?? 25,
            companyId ?? null,
            sort ?? null,
            search ?? null,
            search1 ?? null,
            search2 ?? null
        ).pipe(
            catchError(() => {
                return of('No load pending data...');
            }),
            tap((loadPagination: LoadListResponse) => {
                localStorage.setItem(
                    'loadTableCount',
                    JSON.stringify({
                        pendingCount: loadPagination.pagination.count,
                        activeCount: loadPagination.activeCount,
                        closedCount: loadPagination.closedCount,
                        templateCount: loadPagination.templateCount,
                    })
                );

                this.loadPendingStore.set(loadPagination.pagination.data);
            })
        );
    }

    public getActiveData(
        loadType?: number,
        statusType?: number, // statusType -> 1 - pending, 2 - active, 3 - closed
        status?: Array<number>,
        dispatcherIds?: Array<number>,
        dispatcherId?: number,
        dispatchId?: number,
        brokerId?: number,
        shipperId?: number,
        loadId?: number,
        dateFrom?: string,
        dateTo?: string,
        revenueFrom?: number,
        revenueTo?: number,
        truckId?: number,
        driverId?: number,
        rateFrom?: number,
        rateTo?: number,
        paidFrom?: number,
        paidTo?: number,
        dueFrom?: number,
        dueTo?: number,
        pickup?: boolean,
        delivery?: boolean,
        longitude?: number,
        latitude?: number,
        distance?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<any> {
        return this.getLoadList(
            loadType ?? null,
            2,
            status ?? null,
            dispatcherIds ?? null,
            dispatcherId ?? null,
            dispatchId ?? null,
            brokerId ?? null,
            shipperId ?? null,
            loadId ?? null,
            dateFrom ?? null,
            dateTo ?? null,
            revenueFrom ?? null,
            revenueTo ?? null,
            truckId ?? null,
            driverId ?? null,
            rateFrom ?? null,
            rateTo ?? null,
            paidFrom ?? null,
            paidTo ?? null,
            dueFrom ?? null,
            dueTo ?? null,
            pickup ?? null,
            delivery ?? null,
            longitude ?? null,
            latitude ?? null,
            distance ?? null,
            pageIndex ?? 1,
            pageSize ?? 25,
            companyId ?? null,
            sort ?? null,
            search ?? null,
            search1 ?? null,
            search2 ?? null
        ).pipe(
            tap((loadPagination) => {
                localStorage.setItem(
                    'loadTableCount',
                    JSON.stringify({
                        pendingCount: loadPagination.pendingCount,
                        activeCount: loadPagination.pagination.count,
                        closedCount: loadPagination.closedCount,
                        templateCount: loadPagination.templateCount,
                    })
                );

                this.loadActiveStore.set(loadPagination.pagination.data);
            })
        );
    }

    public getClosedData(
        loadType?: number,
        statusType?: number, // statusType -> 1 - pending, 2 - active, 3 - closed
        status?: Array<number>,
        dispatcherIds?: Array<number>,
        dispatcherId?: number,
        dispatchId?: number,
        brokerId?: number,
        shipperId?: number,
        loadId?: number,
        dateFrom?: string,
        dateTo?: string,
        revenueFrom?: number,
        revenueTo?: number,
        truckId?: number,
        driverId?: number,
        rateFrom?: number,
        rateTo?: number,
        paidFrom?: number,
        paidTo?: number,
        dueFrom?: number,
        dueTo?: number,
        pickup?: boolean,
        delivery?: boolean,
        longitude?: number,
        latitude?: number,
        distance?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<any> {
        return this.getLoadList(
            loadType ?? null,
            3,
            status ?? null,
            dispatcherIds ?? null,
            dispatcherId ?? null,
            dispatchId ?? null,
            brokerId ?? null,
            shipperId ?? null,
            loadId ?? null,
            dateFrom ?? null,
            dateTo ?? null,
            revenueFrom ?? null,
            revenueTo ?? null,
            truckId ?? null,
            driverId ?? null,
            rateFrom ?? null,
            rateTo ?? null,
            paidFrom ?? null,
            paidTo ?? null,
            dueFrom ?? null,
            dueTo ?? null,
            pickup ?? null,
            delivery ?? null,
            longitude ?? null,
            latitude ?? null,
            distance ?? null,
            pageIndex ?? 1,
            pageSize ?? 25,
            companyId ?? null,
            sort ?? null,
            search ?? null,
            search1 ?? null,
            search2 ?? null
        ).pipe(
            tap((loadPagination) => {
                if (loadPagination) {
                    localStorage.setItem(
                        'loadTableCount',
                        JSON.stringify({
                            pendingCount: loadPagination.pendingCount,
                            activeCount: loadPagination.activeCount,
                            closedCount: loadPagination.pagination.count,
                            templateCount: loadPagination.templateCount,
                        })
                    );
                }

                this.loadClosedStore.set(loadPagination?.pagination?.data);
            })
        );
    }

    public getTemplateData(
        loadType?: number,
        revenueFrom?: number,
        revenueTo?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ) {
        return this.getLoadTemplateList(
            loadType,
            revenueFrom,
            revenueTo,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        ).pipe(
            tap((loadPagination) => {
                localStorage.setItem(
                    'loadTableCount',
                    JSON.stringify({
                        pendingCount: loadPagination.pendingCount,
                        activeCount: loadPagination.activeCount,
                        closedCount: loadPagination.closedCount,
                        templateCount: loadPagination.pagination.count,
                    })
                );

                this.loadTemplateStore.set(loadPagination.pagination.data);
            })
        );
    }

    public getAllLoads(
        query: FilterOptionsLoad,
        dataType: string
    ): Observable<any> {
        const {
            loadType,
            statusType,
            status,
            dispatcherIds,
            dispatcherId,
            dispatchId,
            brokerId,
            shipperId,
            dateFrom,
            dateTo,
            revenueFrom,
            revenueTo,
            truckId,
            driverId,
            pageIndex,
            pageSize,
            companyId,
            rateFrom,
            rateTo,
            pickup,
            delivery,
            sort,
            searchOne,
            searchTwo,
            searchThree,
        } = query;

        if (dataType === TableStringEnum.PENDING) {
            return this.getPendingData(
                loadType,
                statusType,
                status,
                dispatcherIds,
                dispatcherId,
                dispatchId,
                brokerId,
                shipperId,
                null,
                dateFrom,
                dateTo,
                revenueFrom,
                revenueTo,
                truckId,
                driverId,
                rateFrom,
                rateTo,
                null,
                null,
                null,
                null,
                pickup,
                delivery,
                null,
                null,
                null,
                pageIndex,
                pageSize,
                companyId,
                sort,
                searchOne,
                searchTwo,
                searchThree
            );
        }

        if (dataType === TableStringEnum.ACTIVE) {
            return this.getActiveData(
                loadType,
                statusType,
                status,
                dispatcherIds,
                dispatcherId,
                dispatchId,
                brokerId,
                shipperId,
                null,
                dateFrom,
                dateTo,
                revenueFrom,
                revenueTo,
                truckId,
                driverId,
                rateFrom,
                rateTo,
                null,
                null,
                null,
                null,
                pickup,
                delivery,
                null,
                null,
                null,
                pageIndex,
                pageSize,
                companyId,
                sort,
                searchOne,
                searchTwo,
                searchThree
            );
        }

        if (dataType === TableStringEnum.CLOSED) {
            return this.getClosedData(
                loadType,
                statusType,
                status,
                dispatcherIds,
                dispatcherId,
                dispatchId,
                brokerId,
                shipperId,
                null,
                dateFrom,
                dateTo,
                revenueFrom,
                revenueTo,
                truckId,
                driverId,
                rateFrom,
                rateTo,
                null,
                null,
                null,
                null,
                pickup,
                delivery,
                null,
                null,
                null,
                pageIndex,
                pageSize,
                companyId,
                sort,
                searchOne,
                searchTwo,
                searchThree
            );
        }

        return this.getTemplateData(
            loadType,
            revenueFrom,
            revenueTo,
            pageIndex,
            pageSize,
            companyId,
            sort,
            searchOne,
            searchTwo,
            searchThree
        );
    }
}
