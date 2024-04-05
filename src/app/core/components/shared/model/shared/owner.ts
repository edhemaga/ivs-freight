import { Address } from 'src/app/core/model/address';

export interface OwnerTabData {
    activeCount: number;
    inactiveCount: number;
    allCount: number;
    activeOwners: OwnerData[];
    inactiveOwners: OwnerData[];
    allOwners: OwnerData[];
}

export interface OwnerData {
    id?: number;
    businessName: string;
    lastName: string;
    ssn: string;
    firstName?: string;
    category: string;
    taxNumber: string;
    bankId: number;
    accountNumber: string;
    routingNumber: string;
    truckCount?: number;
    trailerCount?: number;
    status: number;
    locked?: number;
    doc: OwnerDoc;
    checked?: boolean;
    divisionFlag?: number;
    ownerName?: string;
    ownerType?: string;
}

export interface OwnerDoc {
    additionalData: AdditionalData;
}

export interface AdditionalData {
    phone?: string;
    email?: string;
    address?: Address;
    bankData?: any;
    note?: string;
    // addressUnit?: string;
}

// doc: {
//   "address": {
//     "city": "New York",
//     "state": "New York",
//     "address": "666 5th Ave # 33, New York, NY 10103, USA",
//     "country": "US",
//     "zipCode": "10103",
//     "stateShortName": "NY"
//   },
//   "additionalData": {
//     "email": "nmilinkovic46@gmail.com",
//     "phone": "0605805487",
//     "address_unit": "53"
//   }
// }
