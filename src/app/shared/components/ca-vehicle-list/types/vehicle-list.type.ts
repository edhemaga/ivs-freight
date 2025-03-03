import { eVehicleList } from '@shared/components/ca-vehicle-list/enums';

export type VehicleListType =
    | eVehicleList.REPAIRED_VEHICLE_LIST
    | eVehicleList.FUELLED_VEHICLE_LIST;
