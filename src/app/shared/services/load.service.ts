import { Injectable } from '@angular/core';

import { Observable, Subject, forkJoin, tap } from 'rxjs';

// services
import { FormDataService } from '@shared/services/form-data.service';

// enum
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { LoadModalStringEnum } from '@pages/load/pages/load-modal/enums/load-modal-string.enum';

// store
import { LoadDetailsListStore } from '@pages/load/state/load-details-state/load-details-list-state/load-details-list.store';
import { LoadItemStore } from '@pages/load/state/load-details-state/load-details.store';
import { LoadMinimalListStore } from '@pages/load/state/load-details-state/load-minimal-list-state/load-details-minimal.store';
import { LoadActiveStore } from '@pages/load/state/load-active-state/load-active.store';
import { LoadPendingStore } from '@pages/load/state/load-pending-state/load-pending.store';
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
    LoadPossibleStatusesResponse,
} from 'appcoretruckassist';
import {
    Comment,
    DeleteComment,
} from '@shared/models/card-models/card-table-data.model';
import { Load } from '@pages/load/models/load.model';

@Injectable({
    providedIn: 'root',
})
export class LoadService {
    private newComment: Subject<Comment> = new Subject<Comment>();
    public data$: Observable<Comment> = this.newComment.asObservable();
    private modalAction: Subject<boolean> = new Subject<null>();
    public modalAction$: Observable<boolean> = this.modalAction.asObservable();

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

    // table operations
    public getLoadList(
        loadType?: number,
        statusType?: number, // statusType -> 1 - pending, 2 - active, 3 - closed
        status?: number[],
        dispatcherIds?: Array<number>,
        dispatcherId?: number,
        dispatchId?: number,
        brokerId?: number,
        shipperId?: number,
        dateFrom?: string,
        dateTo?: string,
        revenueFrom?: number,
        revenueTo?: number,
        truckId?: number,
        rateFrom?: number,
        rateTo?: number,
        paidFrom?: number,
        paidTo?: number,
        dueFrom?: number,
        dueTo?: number,
        pickup?: boolean,
        delivery?: boolean,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<LoadListResponse> {
        return this.loadService.apiLoadListGet(
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
            rateFrom,
            rateTo,
            paidFrom,
            paidTo,
            dueFrom,
            dueTo,
            pickup,
            delivery,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
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
            pageIndex,
            pageSize,
            companyId,
            sort,
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

    public getLoadById(id: number): Observable<LoadResponse> {
        return this.loadService.apiLoadIdGet(id);
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
        loadStatus: LoadStatus
    ): Observable<CreateResponse> {
        return this.loadService.apiLoadStatusPut({
            id: loadId,
            status: loadStatus,
        });
    }

    // modal operations - template
    public createLoadTemplate(
        data: CreateLoadTemplateCommand
    ): Observable<CreateResponse> {
        return this.loadService.apiLoadTemplatePost(data);
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

    private getLoadStatus(statusString: string): {
        isPending: boolean;
        isActive: boolean;
        isClosed: boolean;
    } {
        const isPending =
            statusString === LoadModalStringEnum.ASSIGNED ||
            statusString === LoadModalStringEnum.UNASSIGNED;
        const isClosed = statusString === LoadModalStringEnum.CLOSED;
        const isActive = !isPending && !isClosed;

        return {
            isPending,
            isActive,
            isClosed,
        };
    }

    public updateLoadPartily(
        loadResponse: LoadListResponse,
        previusStatus: string
    ): void {
        const data = loadResponse.pagination.data[0];
        const loadId = data.id;
        const { isActive, isPending, isClosed } = this.getLoadStatus(
            data.status.statusString
        );

        [
            this.loadActiveStore,
            this.loadClosedStore,
            this.loadPendingStore,
        ].forEach((store) => {
            store.remove(({ id }) => id === loadId);
        });

        const loadCount = JSON.parse(
            localStorage.getItem(TableStringEnum.LOAD_TABLE_COUNT)
        );

        if (isActive) {
            this.loadActiveStore.add(data);
            loadCount.activeCount++;
        } else if (isClosed) {
            this.loadClosedStore.add(data);
            loadCount.closedCount++;
        } else if (isPending) {
            this.loadPendingStore.add(data);
            loadCount.pendingCount++;
        }

        const previusLoadStore = this.getLoadStatus(previusStatus);
        if (previusLoadStore.isActive) {
            loadCount.activeCount--;
        } else if (previusLoadStore.isClosed) {
            loadCount.closedCount--;
        } else if (previusLoadStore.isPending) {
            loadCount.pendingCount--;
        }

        localStorage.setItem(
            TableStringEnum.LOAD_TABLE_COUNT,
            JSON.stringify(loadCount)
        );

        this.triggerModalAction();
    }

    public addNewLoad(data: LoadListResponse, isTemplate: boolean): void {
        const loadCount = JSON.parse(
            localStorage.getItem(TableStringEnum.LOAD_TABLE_COUNT)
        );

        if (isTemplate) {
            this.loadTemplateStore.add(data.pagination.data[0]);
            loadCount.template++;
        } else {
            this.loadPendingStore.add(data.pagination.data[0]);
            loadCount.pendingCount++;
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
    
}
