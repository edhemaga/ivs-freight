import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// environment
import { environment } from 'src/environments/environment';

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
    UpdateLoadStatusCommand,
    CreateCommentCommand,
    CommentService,
    CommentResponse,
    LoadTemplateResponseCreateGenericWithUploadsResponse,
    LoadListDtoCreateGenericWithUploadsResponse,
} from 'appcoretruckassist';
import {
    Comment,
    DeleteComment,
} from '@shared/models/card-models/card-table-data.model';
import { Load } from '@pages/load/models/load.model';
import {
    IGetLoadListParam,
    IGetLoadTemplateParam,
} from '@pages/load/pages/load-table/models/index';

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
        private httpClient: HttpClient,
        private loadService: LoadBackendService,
        private commentService: CommentService,
        private formDataService: FormDataService,
        private routingService: RoutingService
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

    // table operations
    public getLoadList(param: IGetLoadListParam): Observable<LoadListResponse> {
        const { ..._params } = param || {};

        return this.loadService.apiLoadListGet(
            _params.loadType,
            _params.statusType,
            _params.status,
            _params.dispatcherIds,
            _params.dispatcherId,
            _params.dispatchId,
            _params.brokerId,
            _params.shipperId,
            _params.loadId,
            _params.loadIds,
            _params.dateFrom,
            _params.dateTo,
            _params.revenueFrom,
            _params.revenueTo,
            _params.truckId,
            _params.driverId,
            _params.rateFrom,
            _params.rateTo,
            _params.paidFrom,
            _params.paidTo,
            _params.dueFrom,
            _params.dueTo,
            _params.pickup,
            _params.delivery,
            _params.longitude,
            _params.latitude,
            _params.distance,
            _params.pageIndex,
            _params.pageSize,
            _params.companyId,
            _params.sort,
            _params.sortOrder,
            _params.sortBy as any,
            _params.search,
            _params.search1,
            _params.search2
        );
    }

    public getLoadMinimalList(
        pageIndex?: number,
        pageSize?: number
    ): Observable<LoadMinimalListResponse> {
        return this.loadService.apiLoadListMinimalGet(pageIndex, pageSize);
    }

    public getLoadTemplateList(
        param: IGetLoadTemplateParam
    ): Observable<LoadTemplateListResponse> {
        const { ...params } = param || {};

        return this.loadService.apiLoadTemplateListGet(
            params.loadType,
            params.revenueFrom,
            params.revenueTo,
            params.loadId,
            params.pageIndex,
            params.pageSize,
            params.companyId,
            params.sort,
            params.sortOrder,
            params.sortBy as any,
            params.search,
            params.search1,
            params.search2
        );
    }

    // TODO: make load details use store
    public deleteLoadById(loadId: number): Observable<void> {
        return this.loadService.apiLoadIdDelete(loadId);
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

    // used in load-modal
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

    // used in ta-table-body
    public getLoadListLoadstop(
        loadId: number
    ): Observable<LoadListLoadStopResponse> {
        return this.loadService.apiLoadListLoadstopIdGet(loadId);
    }

    // used in load-modal
    public getRouting(location: string): Observable<RoutingResponse> {
        return this.routingService.apiRoutingGet(location);
    }

    public updateLoadTemplate(
        data: CreateLoadTemplateCommand
    ): Observable<LoadTemplateResponseCreateGenericWithUploadsResponse> {
        return this.loadService.apiLoadTemplatePut(data);
    }

    public getLoadTemplateById(id: number): Observable<LoadTemplateResponse> {
        return this.loadService.apiLoadTemplateIdGet(id);
    }
    public deleteLoadTemplateById(id: number): Observable<void> {
        return this.loadService.apiLoadTemplateIdDelete(id);
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

    // used in ta-status and ta-table-body
    public getLoadStatusDropdownOptions(
        id: number
    ): Observable<LoadPossibleStatusesResponse> {
        return this.loadService.apiLoadListStatusIdGet(id);
    }

    // used in dispatch-assign-load-modal
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

    public apiGetLoadById(id: number): Observable<LoadResponse> {
        return this.loadService.apiLoadIdGet(id);
    }

    public apiGetLoadTemplateById(
        id: number
    ): Observable<LoadTemplateResponse> {
        return this.loadService.apiLoadTemplateIdGet(id);
    }

    public apiGetLoadModal(): Observable<LoadModalResponse> {
        return this.loadService.apiLoadModalGet();
    }

    public apiGetLoadPossibleStatusesDropdownOptions(
        id: number
    ): Observable<LoadPossibleStatusesResponse> {
        return this.loadService.apiLoadListStatusIdGet(id);
    }

    public apiGetCommentById(id: number): Observable<CommentResponse> {
        return this.commentService.apiCommentIdGet(id);
    }

    public apiUpdateLoadStatus(param: UpdateLoadStatusCommand) {
        return this.loadService.apiLoadStatusPut(param);
    }

    public apiRevertLoadStatus(param: UpdateLoadStatusCommand) {
        return this.loadService.apiLoadStatusRevertPut(param);
    }

    public apiUpdateLoad(data: Load): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.loadService.apiLoadPut();
    }

    public apiUpdateLoadTemplate(
        data: CreateLoadTemplateCommand
    ): Observable<LoadTemplateResponseCreateGenericWithUploadsResponse> {
        return this.loadService.apiLoadTemplatePut(data);
    }

    public apiCreateComment(
        param: CreateCommentCommand
    ): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(param);
        return this.commentService.apiCommentPost(param);
    }

    public apiCreateLoad(
        data: Load
    ): Observable<LoadListDtoCreateGenericWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.loadService.apiLoadPost();
    }

    public apiCreateLoadTemplate(
        param: CreateLoadTemplateCommand
    ): Observable<LoadTemplateResponseCreateGenericWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(param);
        return this.loadService.apiLoadTemplatePost(param);
    }

    public apiDeleteBulkLoads(ids: number[]): Observable<any> {
        const body = {
            Ids: ids,
        };

        return this.httpClient.post<any>(
            `${environment.API_ENDPOINT}/api/load/list`,
            body
        );
    }

    public apiDeleteBulkLoadTemplates(ids: number[]): Observable<any> {
        const body = {
            Ids: ids,
        };

        return this.httpClient.post<any>(
            `${environment.API_ENDPOINT}/api/load/template/list`,
            body
        );
    }
}
