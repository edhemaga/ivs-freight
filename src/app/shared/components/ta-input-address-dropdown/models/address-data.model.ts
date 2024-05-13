import { InputAddressCommandsStringEnum } from '@shared/components/ta-input-address-dropdown/enums/input-address-commands-string.enum';

// models
import { AddressEntity } from 'appcoretruckassist';
import { LongLat } from '@shared/components/ta-input-address-dropdown/models/long-lat.model';

export interface AddressData {
    address: AddressEntity;
    longLat: LongLat;
    valid: boolean;
    type?: InputAddressCommandsStringEnum;
}
