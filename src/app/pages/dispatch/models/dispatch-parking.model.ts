import {
    ParkingDispatchModalResponse,
    ParkingSlotShortResponse,
} from 'appcoretruckassist';

export interface DispatchBoardParking extends ParkingDispatchModalResponse {
    isDropdownVisible: boolean;
}

export interface DispatchBoardParkingEmiter {
    parking: number;
    truckId: number;
    trailerId: number;
}
