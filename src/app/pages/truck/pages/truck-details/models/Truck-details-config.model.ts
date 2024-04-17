import type { TruckDetailsConfigDataModel } from './truck-details-config-data.model';

export interface TruckDetailsConfigModel {
    id: number;
    name: string;
    template: string;
    data: TruckDetailsConfigDataModel[];
    length?: number;
    status?: boolean;
    isExpired?: boolean;
}
