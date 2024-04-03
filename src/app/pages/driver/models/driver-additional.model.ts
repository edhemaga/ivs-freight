import { Address } from "ngx-google-places-autocomplete/objects/address";
import { Avatar } from "src/app/shared/models/avatar.model";
import { Bank } from "src/app/shared/models/bank.model";
import { Bussiness } from "src/app/shared/models/bussiness.model";

export interface DriverAdditional {
    note?: any;
    type: string;
    email: string;
    phone: string;
    avatar: Avatar;
    address: Address;
    bankData: Bank;
    dateOfBirth: string;
    paymentType: any;
    businessData: Bussiness;
    notifications: any[];
    birthDateShort: string;
}