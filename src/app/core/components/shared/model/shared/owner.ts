// import { Contact } from './contact';
// import { BankAccount } from './bankAccount';
// import { ServerResponse, ServerResponseList } from './response';
// import { Enums } from './enums';

import { Address } from '../address';

// export interface Owner {
//   id: number;
//   name: string;
//   lastName: string;
//   contact: Contact;
//   bank: any;
//   bankAccount: BankAccount;
//   type: Enums;
//   taxId: string;
//   email: string;
//   phones: any;
//   street: string;
//   address_unit: string;
//   checked: boolean;
//   status: any;
// }

// export interface OwnerNewApi {
//   activeCount: number;
//   inactiveCount: number;
//   allCount: number;
//   activeOwners: Owner[];
//   inactiveOwners: Owner[];
//   allOwners: Owner[];
// }

// export interface OwnerData {
//   id: number;
//   name: string;
//   lastName: string;
//   bank: any;
//   taxId: string;
//   email: string;
//   phones: any;
//   street: string;
//   address_unit: string;
//   checked: boolean;
// }

// export interface OwnerDataResult {
//   data: Owner[];
//   activeOwners: Owner[];
//   inactiveOwners: Owner[];
// }

// export interface OwnerList extends ServerResponseList {
//   data: Owner[];
// }

// export interface OwnerDetail extends ServerResponse {
//   data: Owner;
// }

// export interface OwnerCount {
//   id: number;
//   name: string;
//   lastName: string;
//   trailersCount: number;
//   truckCount: number;
//   type: Enums;
// }

// export interface OwnerListCount extends ServerResponseList {
//   data: OwnerCount[];
// }

// export interface OwnerDetailCount extends ServerResponse {
//   data: OwnerCount;
// }

// export interface OwnerColumn {
//   name: string;
//   title: string;
//   resizable: boolean;
//   hidden: boolean;
//   disabled: boolean;
//   field: string;
//   width: any;
//   minWidth: any;
//   orderIndex: number;
//   sortable: boolean;
//   alignCenter: boolean;
//   number: boolean;
//   disableExport: boolean;
//   filterable: boolean;
// }

// API V2
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
