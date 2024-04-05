import type { AddressEntity } from 'appcoretruckassist';
import type { InputAddressCommandsStringEnum } from '../enum/input-address-commands-string.enum';
import type { LongLat } from './long-lat.model';

export interface AddressData {
    address: AddressEntity;
    longLat: LongLat;
    valid: boolean;
    type?: InputAddressCommandsStringEnum;
}
