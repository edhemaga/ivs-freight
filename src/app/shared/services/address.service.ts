import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

//Models
import { AddressListResponse, AddressResponse } from 'appcoretruckassist';

//Services
import { GeolocationService } from '../../../../appcoretruckassist/api/geolocation.service';

@Injectable({
    providedIn: 'root',
})
export class AddressService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(
        private geoService: GeolocationService,
        private http: HttpClient
    ) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public getAddresses(
        text: string,
        layers: string[],
        closedBorder: boolean
    ): Observable<AddressListResponse> {
        const headers = {
            'x-api-key': environment.GOOGLE_AUTOCOMPLETE_KEY,
        };

        const url = `${environment.API_ENDPOINT}/api/geolocation/autocomplete`;

        return this.http.get<AddressListResponse>(url, {
            headers,
            params: {
                text,
                layers,
                closedBorder,
            },
        });
    }

    public getAddressInfo(address: string): Observable<AddressResponse> {
        return this.geoService.apiGeolocationAddressGet(address);
    }
}
