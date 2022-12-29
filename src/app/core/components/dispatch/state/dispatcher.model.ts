import { DispatchBoardResponse, DispatchHosResponse, DispatchResponse } from 'appcoretruckassist';

export interface IDispatcher {
    modal: any[];
    dispatchList: any[];
}

export interface IdispatcherHosResponse extends DispatchHosResponse{
    indx: number;
}

interface DispatchBoardLResponse extends DispatchResponse {
    isPhone?: boolean;
    hoursOfService?: Array<IdispatcherHosResponse> | null;
}

export interface DispatchBoardLocalResponse extends DispatchBoardResponse {
    dispatches?: DispatchBoardLResponse[];
}
