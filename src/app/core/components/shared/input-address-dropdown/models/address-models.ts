import { AddressEntity, AddressResponse } from "appcoretruckassist";
import { Commands } from "../enums/addres-enums";

export interface AddressList {
    id: number;
    name: string;
    address?: string;
}

export interface CommandProperties {
    popup: {
        name: string;
        backgroundColor: string;
    };
    svg: string;
}

export interface CommandsHandler {
    commands: {
        firstCommand: CommandProperties;
        secondCommand: CommandProperties;
    };
}

export interface LongLat {
    latitude?: number;
    longitude?: number;
}

export interface AddressData {
    address: AddressEntity;
    longLat: LongLat;
    valid: boolean;
    type?: Commands
}
