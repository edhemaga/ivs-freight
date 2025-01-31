import { takeUntil } from 'rxjs';

//m ixin
import { DestroyableMixin } from '@shared/mixins/destroyable.mixin';

// services
import { AddressService } from '@shared/services/address.service';

// models
import { AddressProperties } from '@shared/components/ta-input-address-dropdown/models/address-properties';
import { AddressListResponse, AddressResponse } from 'appcoretruckassist';
import { Constructor } from '@shared/models/mixin.model';

export function AddressMixin<T extends Constructor>(Base: T) {
    return class extends DestroyableMixin(Base) {
        addressList: AddressListResponse;
        addressData: AddressResponse;

        public onAddressChange(
            { query, searchLayers, closedBorder }: AddressProperties,
            addressService: AddressService
        ): void {
            addressService
                .getAddresses(query, searchLayers, closedBorder)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => (this.addressList = res));
        }

        public getAddressData(
            address: string,
            addressService: AddressService
        ): void {
            addressService
                .getAddressInfo(address)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => (this.addressData = res));
        }
    };
}
