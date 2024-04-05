import type { AddressEntity } from 'appcoretruckassist';
import type { InputAddressCommandsEnum } from '../enum/input-address-commands.enum';
import type { LongLat } from './long-lat.model';

export interface AddressData {
    address: AddressEntity;
    longLat: LongLat;
    valid: boolean;
    type?: InputAddressCommandsEnum;
}
