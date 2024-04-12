import type { InputAddressCommandsStringEnum } from '@shared/components/ta-input-address-dropdown/enums/input-address-commands-string.enum';

// models
import type { AddressEntity } from 'appcoretruckassist';
import type { LongLat } from './long-lat.model';

export interface AddressData {
    address: AddressEntity;
    longLat: LongLat;
    valid: boolean;
    type?: InputAddressCommandsStringEnum;
}
