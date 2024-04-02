import { DispatchBoardResponse, DispatchResponse } from 'appcoretruckassist';
import { IdispatcherHosResponse } from './dispatcher-hos-response.model';

interface DispatchBoardLResponse extends DispatchResponse {
    isPhone?: boolean;
    hoursOfService?: Array<IdispatcherHosResponse> | null;
}

export interface DispatchBoardLocalResponse extends DispatchBoardResponse {
    dispatches?: DispatchBoardLResponse[];
}
