// models
import { AddressEntity } from 'appcoretruckassist';
import { LongLat } from '@shared/components/ta-input-address-dropdown/models/long-lat.model';

// enums
import { eGeneralActions } from '@shared/enums';

export interface AddressData {
    address: AddressEntity;
    longLat: LongLat;
    valid: boolean;
    type?: eGeneralActions;
}
