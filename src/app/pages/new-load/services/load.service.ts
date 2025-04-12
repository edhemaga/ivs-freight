import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';

// Models
import {
    DispatcherFilterResponse,
    LoadListResponse,
    LoadStatusFilterResponse,
    LoadTemplateListResponse,
} from 'appcoretruckassist';

// Environment
import { environment } from 'src/environments/environment';

// Interface
import { IStateFilters } from '@shared/interfaces';

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
        let params = new HttpParams().set('statusType', statusType.toString());

        if (filters.dispatcherIds?.length) {
            filters.dispatcherIds.forEach((id) => {
                params = params.append('DispatcherIds', id.toString());
            });
        }

        if (filters.status?.length) {
            filters.status.forEach((status) => {
                params = params.append('status', status.toString());
            });
        }

        return this.http.get<LoadListResponse>(
            `${environment.API_ENDPOINT}/api/load/list`,
            { params }
        );
    }
    public getLoadTemplateList(
        filters: IStateFilters
    ): Observable<LoadTemplateListResponse> {
        return this.http.get(
            `${environment.API_ENDPOINT}/api/load/template/list`
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
}
