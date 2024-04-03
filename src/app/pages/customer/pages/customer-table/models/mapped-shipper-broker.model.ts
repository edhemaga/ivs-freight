import {
    AddressEntity,
    BrokerContactResponse,
    BrokerResponse,
    EnumValue,
    InvoiceAgeingResponse,
    LoadResponse,
    PoBoxEntity,
    ReviewResponse,
    ShipperResponse,
    TimeOnly,
} from 'appcoretruckassist';
import { DropdownItem } from 'src/app/shared/models/card-table-data.model';
import { LoadBroker } from '../../../../../shared/models/load-broker.model';

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
    tableLoads?: string;
    tableAddressPhysical?: string;
    tableAddressBilling?: string;
    tableAverageWatingTimePickup?: string | TimeOnly;
    tableAverageWatingTimeDelivery?: string | TimeOnly;
    tableAvailableHoursShipping?: string;
    tableAvailableHoursReceiving?: string;
    tablePaymentDetailAvailCredit?: string;
    tablePaymentDetailCreditLimit?: string;
    tablePaymentDetailTerm?: string;
    tablePaymentDetailDTP?: string;
    tablePaymentDetailInvAgeing?: {
        bfb: string;
        dnu: string;
        amount: string;
    };
    tableRaiting?: {
        id: 1;
        fullName: string;
        date: string;
        me: boolean;
        avatar: string;
        noAvatar: {
            color: string;
            backgroundColor: string;
            textShort: string;
        };
        liked: boolean;
        disliked: boolean;
        comment: string;
        edited: boolean;
    };
    tableContact?: number;
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
