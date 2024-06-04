import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';

// enviroment
import { environment } from 'src/environments/environment';

// models
import {
    AddressListResponse,
    AddressResponse,
    AutocompleteSearchLayer,
} from 'appcoretruckassist';

// services
import { GeolocationService } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class AddressService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(private geoService: GeolocationService) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public getAddresses(
        text: string,
        layers: AutocompleteSearchLayer[],
        closedBorder: boolean
    ): Observable<AddressListResponse> {
        return this.geoService.apiGeolocationAutocompleteGet(
            text,
            layers,
            closedBorder,
            environment.GOOGLE_AUTOCOMPLETE_KEY
        );
    }

    public getAddressInfo(address: string): Observable<AddressResponse> {
        return this.geoService.apiGeolocationAddressGet(address);
    }
}
