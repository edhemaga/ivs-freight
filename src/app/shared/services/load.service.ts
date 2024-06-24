import { Injectable } from '@angular/core';

import { Observable, Subject, tap } from 'rxjs';

// services
import { FormDataService } from '@shared/services/form-data.service';

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

    private deleteComment: Subject<DeleteComment> =
        new Subject<DeleteComment>();
    public removeComment$: Observable<Comment> =
        this.deleteComment.asObservable();

    constructor(
        private loadService: LoadBackendService,
        private formDataService: FormDataService,
        private routingService: RoutingService
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

    public deleteLoadById(id: number): Observable<void> {
        return this.loadService.apiLoadIdDelete(id);
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
    public getLoadDropdowns(loadEditId?: number): Observable<LoadModalResponse> {
        return this.loadService.apiLoadModalGet(loadEditId);
    }

    public getRouting(location: string): Observable<RoutingResponse> {
        return this.routingService.apiRoutingGet(location);
    }

    public createLoad(data: Load): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.loadService.apiLoadPost().pipe(
            tap(() => {
                
            })
        );
    }

    public updateLoad(data: Load): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.loadService.apiLoadPut().pipe(
            tap(() => {
                
            })
        );
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
}
