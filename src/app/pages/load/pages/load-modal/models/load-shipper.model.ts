import { AddressEntity, ShipperShortResponse } from "appcoretruckassist";

export interface LoadShipper extends Omit<ShipperShortResponse, 'address'> {
    address?: string | AddressEntity;
}