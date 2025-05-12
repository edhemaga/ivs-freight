import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// RxJS
import { Observable } from 'rxjs';

// Modesl
import { RoutingResponse } from 'appcoretruckassist/model/routingResponse';

// Environment
import { environment } from 'src/environments/environment';

// Models
import { LongLat } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class RoutingService {
    constructor(public http: HttpClient) {}
    public getRoutingMiles(locations: LongLat[]): Observable<RoutingResponse> {
        const params = new HttpParams().set(
            'Locations',
            JSON.stringify(locations)
        );

        return this.http.get<RoutingResponse>(
            `${environment.API_ENDPOINT}/api/routing`,
            { params }
        );
    }
}
