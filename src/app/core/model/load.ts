import { Enums } from './enums';

export class LoadResponse {
    count: any[];
    loads: Load[];
}

export class Load {
    id: number;
    loadNumber: number;
    customerLoadNumber: string;
    customer: string;
    pickups: Pickup[];
    destinations: Destination[];
    total: number;
    status: string;
    note: string;
    truck: { name: string };
    dispatcher: Enums;
    checked: boolean;
    mileage: Load;
}

export class Pickup {
    city: string;
    date: Date;
    state: string;
}

export class Destination {
    city: Enums;
    date: Date;
    state: string;
}
