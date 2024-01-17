import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// services
import { FormDataService } from 'src/app/core/services/formData/form-data.service';

// models
import {
    CreateResponse,
    LoadListResponse,
    LoadService,
    LoadTemplateListResponse,
    LoadTemplateResponse,
    LoadResponse,
    LoadMinimalListResponse,
    LoadModalResponse,
    CreateLoadTemplateCommand,
    LoadStopItemAutocompleteDescriptionResponse,
    CreateWithUploadsResponse,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class LoadTService {
    constructor(
        private loadService: LoadService,
        private formDataService: FormDataService
    ) {}

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

    public getLoadById(loadId: number): Observable<LoadResponse> {
        return this.loadService.apiLoadIdGet(loadId);
    }

    public autocompleteLoadByDescription(
        description: string
    ): Observable<LoadStopItemAutocompleteDescriptionResponse> {
        return this.loadService.apiLoadStopsAutocompleteDescriptionDescriptionGet(
            description
        );
    }

    // modal operations

    public getLoadDropdowns(id?: number): Observable<LoadModalResponse> {
        return this.loadService.apiLoadModalGet(id);
    }

    public createLoad(data: any): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.loadService.apiLoadPost();
    }

    public updateLoad(data: any): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.loadService.apiLoadPut();
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
