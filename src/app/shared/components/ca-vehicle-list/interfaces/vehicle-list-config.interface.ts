import { VehicleListType } from '@shared/components/ca-vehicle-list/types';

// models
import {
    FuelledVehicleResponse,
    RepairedVehicleResponse,
} from 'appcoretruckassist';

export interface IVehicleListConfig {
    type?: VehicleListType;
    list: (RepairedVehicleResponse | FuelledVehicleResponse)[];
    isSearchActive?: boolean;
}
