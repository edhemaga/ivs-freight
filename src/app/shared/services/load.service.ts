import { Injectable } from '@angular/core';

import { Observable, Subject, tap } from 'rxjs';

// services
import { FormDataService } from '@shared/services/form-data.service';

// enum
import { TableStringEnum } from '@shared/enums/table-string.enum';

// store
import { LoadDetailsListStore } from '@pages/load/state/load-details-state/load-details-list-state/load-details-list.store';
import { LoadItemStore } from '@pages/load/state/load-details-state/load-details.store';
import { LoadMinimalListStore } from '@pages/load/state/load-details-state/load-minimal-list-state/load-details-minimal.store';
import { LoadActiveStore } from '@pages/load/state/load-active-state/load-active.store';
import { LoadPendingStore } from '@pages/load/state/load-pending-state/load-pending.store';
import { LoadClosedStore } from '@pages/load/state/load-closed-state/load-closed.store';

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
} from 'appcoretruckassist';
import {
    Comment,
    DeleteComment,
} from '@shared/models/card-models/card-table-data.model';
import { Load } from '@pages/load/models/load.model';
import { LoadTemplateStore } from '@pages/load/state/load-template-state/load-template.store';

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
        private loadTemplateStore: LoadTemplateStore
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
        status?: number,
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

    public getLoadById(id: number): Observable<LoadResponse> {
        return this.loadService.apiLoadIdGet(id);
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

    public updateLoadStatus(loadId: number, loadStatus: LoadStatus) {
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

    public updateLoadPartily(data: LoadResponse, loadStatus: string) {
        const loadId = data.id;

        if (loadStatus === TableStringEnum.ACTIVE) {
            this.loadActiveStore.remove(({ id }) => id === loadId);
            this.loadActiveStore.add(data);
        } else if (loadStatus === TableStringEnum.CLOSED) {
            this.loadClosedStore.remove(({ id }) => id === loadId);
            this.loadClosedStore.add(data);
        } else if (loadStatus === TableStringEnum.PENDING) {
            this.loadPendingStore.remove(({ id }) => id === loadId);
            this.loadPendingStore.add(data);
        }

        this.triggerModalAction();
    }

    public addNewLoad(data: LoadResponse, isTemplate: boolean) {
        const loadCount = JSON.parse(
            localStorage.getItem(TableStringEnum.LOAD_TABLE_COUNT)
        );

        if (isTemplate) {
            this.loadTemplateStore.add(data);
            loadCount.template++;
        } else {
            this.loadPendingStore.add(data);
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

    public triggerModalAction() {
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
}
