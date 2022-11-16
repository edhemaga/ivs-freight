import { DispatchBoardResponse, DispatchResponse } from 'appcoretruckassist';

export interface IDispatcher {
  modal: any[];
  dispatchList: any[];
}

interface DispatchBoardLResponse extends DispatchResponse {
  isPhone?: boolean;
}

export interface DispatchBoardLocalResponse extends DispatchBoardResponse {
  dispatches?: DispatchBoardLResponse[];
}
