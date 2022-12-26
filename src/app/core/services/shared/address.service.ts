import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { GeolocationService } from './../../../../../appcoretruckassist/api/geolocation.service';

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

    public getAddresses(addressData, layers, closedBorder) {
        return this.geoService.apiGeolocationAutocompleteGet(
            addressData,
            layers,
            closedBorder
        );
    }

    public getAddressInfo(address) {
        return this.geoService.apiGeolocationAddressGet(address);
    }
}
