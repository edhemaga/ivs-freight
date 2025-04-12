import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';

// Models
import { LoadListResponse, LoadTemplateListResponse } from 'appcoretruckassist';

// Environment
import { environment } from 'src/environments/environment';

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
}
