import {Address} from './address';

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
}
