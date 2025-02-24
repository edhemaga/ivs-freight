import { Constructor } from '@shared/models/mixin.model';
import { DestroyableMixin } from '../destroyable.mixin';
import { takeUntil } from 'rxjs';
import { AddressService } from '@shared/services/address.service';
import { AddressProperties } from '@shared/components/ta-input-address-dropdown/models/address-properties';
import { AddressListResponse, AddressResponse } from 'appcoretruckassist';
import { ChangeDetectorRef } from '@angular/core';

export function AddressMixin<
    T extends Constructor<{
        addressService: AddressService;
        cdr?: ChangeDetectorRef;
    }>,
>(Base: T) {
    return class extends DestroyableMixin(Base) {
        // Extending DestroyableMixin
        addressList: AddressListResponse;
        addressData: AddressResponse;

        onAddressChange({
            query,
            searchLayers,
            closedBorder,
        }: AddressProperties): void {
            this.addressService
                .getAddresses(query, searchLayers, closedBorder)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.addressList = res;
                    this.cdr?.detectChanges();
                });
        }

        getAddressData(address: string): void {
            this.addressService
                .getAddressInfo(address)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.addressData = res;
                    this.cdr?.detectChanges();
                });
        }
    };
}
