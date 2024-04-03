import { DispatchBoardResponse, DispatchResponse } from 'appcoretruckassist';
import { DispatcherHosResponse } from '../../../../../models/dispatcher-hos-response.model';

interface DispatchBoardLResponse extends DispatchResponse {
    isPhone?: boolean;
    hoursOfService?: Array<DispatcherHosResponse> | null;
}

export interface DispatchBoardLocalResponse extends DispatchBoardResponse {
    dispatches?: DispatchBoardLResponse[];
}
