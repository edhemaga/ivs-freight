import { MapStop } from '@shared/models/map-stop.model';

export interface MapRoute {
    stops?: Array<MapStop>;
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
