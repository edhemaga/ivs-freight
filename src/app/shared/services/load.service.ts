import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

// services
import { FormDataService } from 'src/app/core/services/formData/form-data.service';

//Model

import {
    Comment,
    DeleteComment,
} from 'src/app/core/components/shared/model/card-table-data.model';

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
    // CreateLoadTemplateCommand,
    LoadStopItemAutocompleteDescriptionResponse,
    CreateWithUploadsResponse,
    RoutingService,
    RoutingResponse,
} from 'appcoretruckassist';
import { Load } from 'src/app/pages/load/models/load.model';

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
        dispatcherId?: number,
        dispatchId?: number,
        brokerId?: number,
        shipperId?: number,
        dateFrom?: string,
        dateTo?: string,
        revenueFrom?: number,
        revenueTo?: number,
        truckId?: number,
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
            dispatcherId,
            dispatchId,
            brokerId,
            shipperId,
            dateFrom,
            dateTo,
            revenueFrom,
            revenueTo,
            truckId,
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
    public getLoadDropdowns(): Observable<LoadModalResponse> {
        return this.loadService.apiLoadModalGet();
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

    // modal operations - template
    // CreateLoadTemplateCommand this was data response here but it changed
    public createLoadTemplate(data): Observable<CreateResponse> {
        return this.loadService.apiLoadTemplatePost(data);
    }

    public getLoadTemplateById(id: number): Observable<LoadTemplateResponse> {
        return this.loadService.apiLoadTemplateIdGet(id);
    }
}
