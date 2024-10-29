import {
    AddressEntity,
    BrokerContactResponse,
    BrokerResponse,
    EnumValue,
    InvoiceAgeingResponse,
    LoadResponse,
    PoBoxEntity,
    ReviewResponse,
    ShipperContactResponse,
    ShipperResponse,
} from 'appcoretruckassist';
import {
    CreditProgressData,
    DropdownItem,
} from '@shared/models/card-models/card-table-data.model';
import { LoadBroker } from '@shared/models/load-broker.model';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

export interface MappedShipperBroker {
    id?: number;
    businessName?: string | LoadBroker;
    dbaName?: string | null;
    mcNumber?: string | null;
    ein?: string | null;
    email?: string | null;
    phone?: string | null;
    mainAddress?: AddressEntity;
    billingAddress?: AddressEntity;
    mainPoBox?: PoBoxEntity;
    billingPoBox?: PoBoxEntity;
    creditLimit?: number | null;
    availableCredit?: number | null;
    percentage?: number | null;
    payTerm?: EnumValue;
    latitude?: number;
    longitude?: number;
    upCount?: number;
    downCount?: number;
    rating?: number;
    loadCount?: number;
    total?: number;
    dnu?: boolean;
    ban?: boolean;
    note?: string | null;
    creditType?: EnumValue;
    brokerContacts?: Array<BrokerContactResponse> | null;
    reviews?: Array<ReviewResponse> | null;
    status?: number;
    currentCompanyUserRating?: number | null;
    totalDebt?: number | null;
    invoiceAgeingGroup?: InvoiceAgeingResponse;
    invoiceAgeingGroupOne?: InvoiceAgeingResponse;
    invoiceAgeingGroupTwo?: InvoiceAgeingResponse;
    invoiceAgeingGroupThree?: InvoiceAgeingResponse;
    invoiceAgeingGroupFour?: InvoiceAgeingResponse;
    daysToPay?: number | null;
    miles?: number | null;
    pricePerMile?: number | null;
    revenue?: number | null;
    createdAt?: string;
    updatedAt?: string;
    loads?: Array<LoadResponse> | null;
    fileCount?: number | null;
    isSelected?: boolean;
    tableAddress?: string;
    tableLoads?: {
        loads: number;
        pickups: number;
        deliveries: number;
    };
    tableAddressPhysical?: string;
    tableAddressBilling?: string;
    tableAverageWatingTimePickup?: string;
    tableAverageWatingTimeDelivery?: string;
    tableAvailableHoursShipping?: string;
    tableAvailableHoursReceiving?: string;
    tablePaymentDetailAvailCredit?: CreditProgressData;
    tablePaymentDetailCreditLimit?: string;
    tablePaymentDetailTerm?: string;
    tablePaidInvAging?: {
        id?: number;
        mcNumber?: string | null;
        ein?: string | null;
        payTerm?: EnumValue;
        creditType?: EnumValue;
        creditLimit?: number | null;
        availableCredit?: number | null;
        percentage?: number | null;
        totalDebt?: number | null;
        totalPaid?: number | null;
        averageRate?: number | null;
        highestRate?: number | null;
        lowestRate?: number | null;
        invoiceAgeingGroup?: InvoiceAgeingResponse;
        invoiceAgeingGroupOne?: InvoiceAgeingResponse;
        invoiceAgeingGroupTwo?: InvoiceAgeingResponse;
        invoiceAgeingGroupThree?: InvoiceAgeingResponse;
        invoiceAgeingGroupFour?: InvoiceAgeingResponse;
        daysToPay?: number | null;
        miles?: number | null;
        pricePerMile?: number | null;
        revenue?: number | null;
        invoiceAgeing?: number;
        tablePayTerm?: EnumValue;
    };
    tableUnpaidInvAging?: {
        id?: number;
        mcNumber?: string | null;
        ein?: string | null;
        payTerm?: EnumValue;
        creditType?: EnumValue;
        creditLimit?: number | null;
        availableCredit?: number | null;
        percentage?: number | null;
        totalDebt?: number | null;
        totalPaid?: number | null;
        averageRate?: number | null;
        highestRate?: number | null;
        lowestRate?: number | null;
        invoiceAgeingGroup?: InvoiceAgeingResponse;
        invoiceAgeingGroupOne?: InvoiceAgeingResponse;
        invoiceAgeingGroupTwo?: InvoiceAgeingResponse;
        invoiceAgeingGroupThree?: InvoiceAgeingResponse;
        invoiceAgeingGroupFour?: InvoiceAgeingResponse;
        daysToPay?: number | null;
        miles?: number | null;
        pricePerMile?: number | null;
        revenue?: number | null;
        invoiceAgeing?: number;
        tablePayTerm?: EnumValue;
    };
    tableRaiting?: {
        hasLiked: boolean;
        hasDislike: boolean;
        likeCount: number | TableStringEnum;
        dislikeCount: number | TableStringEnum;
    };
    tableContactData?: ShipperContactResponse[] | BrokerContactResponse[];
    tableAdded?: string;
    tableEdited?: string;
    tableDropdownContent?: {
        hasContent?: boolean;
        content?: DropdownItem[];
    };
    PaymentDetailInvAgeing?: {
        bfb: string;
        dnu: string;
        amount: string;
    };

    data?: ShipperResponse | BrokerResponse;
    actionAnimation?: string;
    tableMiles?: string;
    tablePPM?: string;
    tableRevenue?: string;
}
