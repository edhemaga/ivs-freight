import { Observable } from "rxjs";

//models
import { ByStateResponse, IStateDataTransform } from "@pages/dashboard/pages/dashboard-by-state/models";

export interface IStateConfiguration {
    serviceMethod: () => Observable<ByStateResponse>; 
    dataTransform: (item: any, index: number) => IStateDataTransform;
}