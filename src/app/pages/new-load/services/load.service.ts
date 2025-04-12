import { HttpClient } from '@angular/common/http';
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

// Enums
import { eLoadStatusStringType } from '@pages/new-load/enums';

@Injectable({
    providedIn: 'root',
})
export class LoadService {
    constructor(public http: HttpClient) {}

    public getLoadList(statusType: number): Observable<LoadListResponse> {
        return this.http.get(
            `${environment.API_ENDPOINT}/api/load/list?statusType=${statusType}`
        );
    }

    public getLoadTemplateList(): Observable<LoadTemplateListResponse> {
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
