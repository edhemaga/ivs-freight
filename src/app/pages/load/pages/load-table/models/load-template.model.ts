import { TableDropdownContent } from '@shared/models/card-models/card-table-data.model';
import {
    AdditionalBillingRate,
    BrokerContact,
    Comment,
    Company,
    CurrentLocation,
    Dispatch,
    Dispatcher,
    FirstPickupTime,
    GeneralCommodity,
    LastDeliveryTime,
    LoadDelivery,
    LoadDispatcher,
    LoadInvoice,
    LoadPickup,
    LoadRequirements,
    LoadTotal,
    NextStop,
    Pay,
    ProgressBar,
    SplitLoad,
    StatusHistory,
    StatusType,
    Stop,
    TotalLoadTime,
    Type,
    File,
    LoadStatus,
} from '@pages/load/pages/load-table/models/load.model';
import { LoadBroker } from '@shared/models/load-broker.model';
import {
    LoadBrokerInfo,
    LoadListDto,
    LoadStatusResponse,
} from 'appcoretruckassist';
import { IAssignData, RateData } from '@pages/load/pages/load-table/models/index';

export interface LoadTemplate extends LoadListDto {
    isSelected?: boolean;
    id?: number;
    type?: Type;
    loadNumber?: string;
    loadInvoice?: LoadInvoice;
    name?: string;
    statusType?: StatusType;
    status?: LoadStatusResponse;
    lastStatusPassed?: { [key: string]: number } | null;
    dispatcher?: Dispatcher;
    company?: Company;
    dateCreated?: string;
    dispatch?: Dispatch;
    broker?: LoadBrokerInfo;
    brokerContact?: BrokerContact;
    referenceNumber?: string;
    generalCommodity?: GeneralCommodity;
    weight?: number;
    loadRequirements?: LoadRequirements;
    loadDispatcher?: LoadDispatcher;
    stops?: Stop[];
    splitLoad?: SplitLoad;
    note?: string;
    baseRate?: number;
    adjustedRate?: number;
    revisedRate?: number;
    tonuRate?: number;
    driverRate?: number;
    additionalBillingRatesTotal?: number;
    additionalBillingRates?: AdditionalBillingRate[];
    totalRate?: number;
    totalAdjustedRate?: number;
    advancePay?: number;
    pays?: Pay[];
    statusHistory?: StatusHistory[];
    totalPaid?: number;
    totalDue?: number;
    loadedMiles?: number;
    totalMiles?: number;
    totalTimeDays?: number;
    totalTimeHours?: number;
    paidDate?: string;
    invoicedDate?: string;
    shortPaid?: number;
    age?: number;
    daysToPay?: number;
    totalLoadTime?: TotalLoadTime;
    firstPickupTime?: FirstPickupTime;
    lastDeliveryTime?: LastDeliveryTime;
    currentLocation?: CurrentLocation;
    nextStop?: NextStop;
    completedPercentage?: number;
    pendingPercentage?: number;
    closedPercentage?: number;
    progressBar?: ProgressBar[];
    createdAt?: string;
    updatedAt?: string;
    files?: File[];
    fileCount?: number;
    loadTotal?: LoadTotal;
    isFlipped?: boolean;
    loadBroker?: LoadBroker;
    loadTruckNumber?: string;
    loadTrailerNumber?: string;
    loadPickup?: LoadPickup[];
    loadDelivery?: LoadDelivery;
    loadStatus?: LoadStatus;
    textCommodity?: string;
    textMiles?: string;
    textWeight?: number;
    textBase?: string;
    textAdditional?: string;
    textAdvance?: string;
    textPayTerms?: string;
    textDriver?: string;
    comments?: Comment[];
    tableAttachments?: File[];
    tableDropdownContent?: TableDropdownContent;
    emptyMiles?: string;
    loaded?: string;
    loadTemplateName?: string;
    avatarImg?: string;
    tableDriver?: string;
    tableTruck?: string;
    empty?: string;
    tableTrailer?: string;
    contact?: string;
    phone?: string;
    tableTrailerColor?: string;
    tableTrailerName?: string;
    tableTruckColor?: string;
    truckTypeClass?: string;
    tableTrailerTypeClass?: string;
    tableTruckName?: string;
    total?: number;
    tableDoorType?: string;
    tableSuspension?: string;
    year?: number;
    liftgate?: string;
    tableAssignedUnitTruck?: IAssignData;
    tableAssignedUnitTrailer?: IAssignData;
    tabelLength?: string;
    rate?: RateData;
    paid?: string;
    tableAdded?: string;
    tableEdited?: string;
}
