import { MapStopModel } from './map-stop';

export interface MapRouteModel {
    stops?: Array<MapStopModel>;
    routeColor?: string;
    shape?: string;
    id?: number;
    name?: string;
    hidden?: boolean;
    expanded?: boolean;
    routeType?: string;
    truckId?: number;
    stopTime?: any;
    mpg?: any;
    fuelPrice?: any;
    isFocused?: boolean;
}
