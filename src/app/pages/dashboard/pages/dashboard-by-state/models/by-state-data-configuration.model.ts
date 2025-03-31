import { Observable } from "rxjs";

//models
import { ByStateIntervalResponse, ByStateListItem, ByStateResponse } from "@pages/dashboard/pages/dashboard-by-state/models";
import { ByStateReportType } from "appcoretruckassist";

export interface IStateConfiguration {
    serviceMethod: () => Observable<ByStateResponse>; 
    dataTransform: (item: ByStateResponse, index: number, selectedTab: ByStateReportType, intervals?: Array<ByStateIntervalResponse> | null) => ByStateListItem;
}