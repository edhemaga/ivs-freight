import { Constructor } from '@shared/models/mixin.model';
import { takeUntil } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

// services
import { AddressService } from '@shared/services/address.service';
// models
import { AddressListResponse, AddressResponse } from 'appcoretruckassist';
import { AddressProperties } from '@shared/components/ta-input-address-dropdown/models/address-properties';
import { DestroyableMixin } from '@shared/mixins/destroyable.mixin';

export function AddressMixin<
    T extends Constructor<{
        addressService: AddressService;
        cdr?: ChangeDetectorRef;
        handleSelectedAddress?(): void
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
                    this.handleSelectedAddress?.();
                    this.cdr?.detectChanges();
                });
        }
    };
}
