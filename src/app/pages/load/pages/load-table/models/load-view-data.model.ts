// enums
import { LoadModalStopItemsStringEnum } from '@pages/load/enums/load-modal-stop-items-string.enum';
import { TableStringEnum } from '@shared/enums';

// models
import { DropdownItem } from '@shared/models';
import { ICommentWithAvatarColor } from '@pages/load/pages/load-table/models/index';

// appcoretruckassist
import {
    BillingInfo,
    CompanyUserShortResponse,
    EnumValue,
    LoadBrokerInfo,
    LoadDetails,
    LoadDriverInfo,
    LoadRequirementsResponse,
    LoadStatusResponse,
    LoadStopInfo,
    MilesInfo,
} from 'appcoretruckassist';

export interface IViewModelData {
    id?: number;
    billing?: BillingInfo;
    broker?: LoadBrokerInfo;
    createdAt?: string;
    delivery?: LoadStopInfo;
    dispatcher?: CompanyUserShortResponse;
    driver?: LoadDriverInfo;
    fileCount?: number | null;
    lastStatusPassed?: { [key: string]: number } | null;
    loadDetails?: LoadDetails;
    loadNumber?: string | null;
    loadRequirements?: LoadRequirementsResponse;
    loadTemplateName?: string,
    baseRate?: number;
    additionalBillingRatesTotal?: number | null;
    loadType?: EnumValue;
    miles?: MilesInfo;
    pickup?: LoadStopInfo;
    status?: LoadStatusResponse;
    advancePay?: number | null;
    totalRate?: number;
    updatedAt?: string;
    paidDate?: string | null;
    invoicedDate?: string | null;
    totalAdjustedRate?: number | null;
    isSelected?: boolean;
    loadInvoice?: {
        invoice?: string;
        type?: string;
    };
    loadDispatcher?: {
        name?: string
        avatar?: string;
    };
    avatarImg?: string;
    tableDriver?: string;
    tableTruck?: string;
    tableTrailer?: string;
    loadTotal?: {
        total?: string;
        subTotal?: string;
    };
    loadBroker?: {
        hasBanDnu?: boolean;
        isDnu?: boolean,
        name?: string;
    };
    contact?: string;
    phone?: string;
    referenceNumber?: string;
    textCommodity?: string;
    textWeight?: number;
    tableTrailerColor?: string;
    tableTrailerName?: string;
    tableTruckColor?: string;
    truckTypeClass?: string;
    tableTrailerTypeClass?: string;
    tableTruckName?: string;
    loadTrailerNumber?: string;
    loadTruckNumber?: string;
    loadPickup?: {
        count?: number;
        location?: string;
        date?: string;
        time?: string;
        delivery?: boolean;
    }[];
    loadStatus?: {
        status?: string;
        color?: string;
        tab?: string;
        time?: string;
    };
    total?: number;
    empty?: string | number;
    loaded?: string | number;
    tableDoorType?: string;
    tableSuspension?: string;
    year?: number;
    liftgate?: TableStringEnum | LoadModalStopItemsStringEnum;
    tableAssignedUnitTruck?: {
        text?: string;
        type?: string;
        color?: string;
        hover?: boolean;
    };
    tableAssignedUnitTrailer?: {
        text?: string;
        type?: string;
        color?: string;
        hover?: boolean;
    };
    tabelLength?: string;
    textBase?: string;
    textAdditional?: string;
    textAdvance?: string;
    textPayTerms?: string;
    textDriver?: string;
    comments?: ICommentWithAvatarColor[];
    rate?: {
        paid?: string;
        paidDue?: string;
        status?: string;
    };
    tableInvoice?: string;
    tablePaid?: string;
    paid?: string;
    payTerm?: string;
    ageUnpaid?: number | TableStringEnum;
    agePaid?: number | TableStringEnum;
    due?: string;
    tableAdded?: string;
    tableEdited?: string;
    tableAttachments?: any[];
    tableDropdownContent?: DropdownItem[];
    
}
