import { DriverResponse } from 'appcoretruckassist';
import { EditData } from '@shared/models/edit-data.model';

export interface DriverModalEditData extends EditData<DriverResponse> {
    avatarIndex?: number;
    isDispatchCall?: boolean;
}