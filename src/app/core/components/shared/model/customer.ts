import { ServerResponse } from './shared/response';
import { ZipCode } from './shared/zipCode';
import { Address } from './address';

export interface Customers {
    activeCount: number;
    activeBrokers: Customer[];
    allCount: number;
    inactiveCount: number;
    inactiveCustomers: Customer[];
    dnuBrokers: Customer[];
    banBrokers: Customer[];
    allCustomers: Customer[];
    allBrokers: Customer[];
}

export interface Shippers {
    count: number;
    data: Shipper[];
}

// Shipper model
export interface Shipper {
    id: number;
    name: string;
    status: boolean;
    appointments: boolean;
    receivingHours: string;
    zip: ZipCode;
    contactPersons: ContactPersons[];
    city: string;
    state: string;
    stateShortName: string;
    country: string;
    zipCode: number;
    shortAddress: string;
    upCount: number;
    downCount: number;
    thumbUp: number;
    thumbDown: number;
    doc: ManageCustomerDoc;
    total: number | string;
}

export interface ShipperList extends ServerResponse {
    data: Shipper[];
    count: number;
}

export interface ShipperDetail extends ServerResponse {
    data: Shipper;
}

// Customer model
export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    street: string;
    upCount: number;
    downCount: number;
    thumbUp: number;
    thumbDown: number;
    addressUnit: string;
    zip: ZipCode;
    billingContactCheck: boolean;
    streetBilling: string;
    addressUnitBilling: string;
    zipBilling: ZipCode;
    contactPersons: ContactPersons[];
    mcNumber: string;
    loadCount: number;
    totalLoadValue: number;
    doc: ManageCustomerDoc;
    dnu: number;
    ban: number;
    total: number | string;
}

export interface CustomerList extends ServerResponse {
    data: Customer[];
    count: number;
}

export interface CustomerDetail extends ServerResponse {
    data: Customer;
}

// v2 //////////////////////////////////////////////////////////////////////////
export interface ManageCustomer {
    id?: number;
    name: string;
    mcNumber?: string;
    hasBillingContact: 0;
    doc?: ManageCustomerDoc;
    meta?: any;
}

export interface ManageCustomerDoc {
    phone?: number | string;
    email?: string;
    address?: Address;
    addressUnit?: string;
    billingAddress?: BillingAddress;
    contactPersons?: ContactPersons[];
    dbaName?: string;
    note?: string;
}

export interface BillingAddress {
    address?: string;
    addressUnit?: string;
}

export interface ContactPersons {
    id: number;
    name?: string;
    phone?: number;
    email?: string;
}

export interface ManageShipper {
    id?: number;
    name: string;
    status: number;
    doc: ManageShipperDoc;
}

export interface ManageShipperDoc {
    address?: Address;
    phone?: number;
    email?: string;
    addressUnit?: string;
    receivingHours?: string;
    fromReceivedHours?: string;
    toReceivedHours?: string;
    hourOrAppointment?: string;
    mainNote?: string;
    appointments?: number;
    contactPersons?: ContactPersons[];
}

export interface ShipperReiting {
    id: number;
    userId: number;
    shipperId: number;
    thumbUp: number;
    thumbDown: number;
    givenRating: number;
    calculatedRating: number;
    note: string;
    createdAt: string;
    updatedAt: string;
}

/* Customer Reiting Model */
export interface CustomerReiting {
    id: number;
    userId: number;
    customerId: number;
    thumbUp: number;
    thumbDown: number;
    givenRating: number;
    calculatedRating: number;
    note: string;
    createdAt: string;
    updatedAt: string;
}

////////////////////////////////////////////////////////////////////////////////
