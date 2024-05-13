import { TruckDetailsConfigData } from '@pages/truck/pages/truck-details/models/truck-details-config-data.model';

export interface TruckDetailsConfig {
    id: number;
    name: string;
    template: string;
    data: TruckDetailsConfigData[];
    length?: number;
    status?: boolean;
    isExpired?: boolean;
}
