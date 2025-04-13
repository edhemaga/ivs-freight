import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';

// Models
import {
    DispatcherFilterResponse,
    LoadListResponse,
    LoadMinimalListResponse,
    LoadResponse,
    LoadStatusFilterResponse,
    LoadTemplateListResponse,
} from 'appcoretruckassist';

// Environment
import { environment } from 'src/environments/environment';

// Interface
import { IStateFilters } from '@shared/interfaces';

// Helpers
import { LoadHelper } from '@pages/new-load/utils/helpers';

// Enums
import { eLoadStatusStringType } from '@pages/new-load/enums';

@Injectable({
    providedIn: 'root',
})
export class LoadService {
    constructor(public http: HttpClient) {}

    public getLoadList(
        statusType: number,
        filters: IStateFilters
    ): Observable<LoadListResponse> {
        const params = LoadHelper.mapLoadListQueryParams(statusType, filters);

        return this.http.get<LoadListResponse>(
            `${environment.API_ENDPOINT}/api/load/list`,
            { params }
        );
    }
    public getLoadTemplateList(
        filters: IStateFilters
    ): Observable<LoadTemplateListResponse> {
        const params = LoadHelper.mapLoadListQueryParams(0, filters);

        return this.http.get(
            `${environment.API_ENDPOINT}/api/load/template/list`,
            { params }
        );
    }

    public getStatusFilters(
        loadStatusType: eLoadStatusStringType
    ): Observable<LoadStatusFilterResponse[]> {
        return this.http.get<LoadStatusFilterResponse[]>(
            `${environment.API_ENDPOINT}/api/load/status/filter?loadStatusType=${loadStatusType}`
        );
    }

    public getDispatcherFilters(
        loadStatusType: eLoadStatusStringType
    ): Observable<DispatcherFilterResponse[]> {
        return this.http.get<DispatcherFilterResponse[]>(
            `${environment.API_ENDPOINT}/api/load/dispatcher/filter?LoadStatusType=${loadStatusType}`
        );
    }

    public apiGetLoadById(id: number): Observable<LoadResponse> {
        return this.http.get<LoadResponse>(
            `${environment.API_ENDPOINT}/api/load/${id}`
        );
    }

    public apiGetLoadDetailsRouting(id: number): Observable<LoadResponse> {
        return this.http.get<LoadResponse>(
            `${environment.API_ENDPOINT}/api/routing`
        );
    }

    public apiGetLoadDetailsMinimalList(): Observable<LoadMinimalListResponse> {
        return this.http.get<LoadMinimalListResponse>(
            `${environment.API_ENDPOINT}/api/load/list/minimal`
        );
    }
}
