import { AddressEntity } from 'appcoretruckassist';

export interface MapStopModel {
    lat: number;
    long: number;
    id?: number;
    address?: AddressEntity;
    cityAddress?: string;
    empty?: boolean;
    leg?: number;
    total?: number;
    time?: any;
    totalTime?: any;
    stopColor?: string;
    stopNumber?: string;
    orderNumber?: number;
    zIndex?: number
}