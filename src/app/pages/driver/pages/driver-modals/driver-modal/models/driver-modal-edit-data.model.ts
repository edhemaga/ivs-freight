import { DriverResponse } from 'appcoretruckassist';
import { EditData } from '@shared/models/edit-data.model';

export interface DriverModalEditData extends EditData {
    data: DriverResponse;
    avatarIndex?: number;
    isDispatchCall?: boolean;
    isDeactivateOnly?: boolean;
}
