import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Avatar } from '@shared/models/avatar.model';
import { Bank } from '@shared/models/bank.model';
import { Bussiness } from '@shared/models/bussiness.model';

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
