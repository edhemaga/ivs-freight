import {
    TrailerMinimalResponse,
    TruckMinimalResponse,
} from 'appcoretruckassist';
import { TableBodyColorLabel } from '@shared/models/table-models/table-body-color-label.model';

export interface Trucks {
    truckNumber: string;
    status: number;
    owner: string;
    id: number;
    color: {
        companyId: number;
        code: string;
        name: number;
        id: number;
    };
    truckType: {
        id: number;
        companyId: number;
        name: string;
        logoName: string;
    };
}

export interface Trailers {
    trailerNumber: string;
    status: number;
    owner: string;
    id: number;
    trailerType: {
        id: number;
        companyId: number;
        name: string;
        logoName: string;
        hasVolume: boolean;
    };
}

export interface Rating {
    avatarColor?: {
        background?: string;
        color?: string;
    };
    commentContent?: string;
    companyUser?: {
        id: number;
        avatar?: string;
        fullName?: string;
    };
    date?: string;
    disliked?: boolean;
    liked?: boolean;
    edited?: boolean;
    me?: true;
    textShortName?: string;
}

export interface CardDetails {
    tableDOB?: string;
    textShortName?: string;
    avatarColor?: string;
    avatarImg?: string;
    filteredTrucks?: Truck[];
    trailers?: Trailers[];
    truckCount?: number;
    trailerCount?: number;
    descriptionItems?: string[];
    id?: number;
    type?: Type;
    companyContactLabel?: TableBodyColorLabel;
    companyAccountLabel?: TableBodyColorLabel;
    isSelected?: boolean;
    loadNumber?: string;
    statusType?: StatusType;
    status?: number;
    tableDropdownContent?: TableDropdownContent;
    dispatcher?: Dispatcher;
    company?: Company;
    dateCreated?: string;
    dispatch?: Dispatch;
    ban?: boolean;
    dnu?: boolean;
    broker?: Broker;
    brokerContact?: BrokerContact;
    referenceNumber?: string;
    generalCommodity?: GeneralCommodity;
    weight?: number;
    loadRequirements?: LoadRequirements;
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
    commentsCount?: number;
    comments?: Comment[];
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
    trucks?: Trucks[];
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
    items?: {
        description?: string;
        id?: number;
        pmTrailer?: string;
        pmTruck?: string;
        price?: number;
        quantity?: number;
        subtotal?: number;
    }[];
    rating?: Rating[];
    textCommodity?: string;
    textMiles?: string;
    textWeight?: string;
    textBase?: string;
    textAdditional?: string;
    textAdvance?: string;
    textPayTerms?: string;
    textDriver?: string;
    tableAttachments?: File[];
    acCompressor?: PmTruckProgressData;
    airCompressor?: PmTruckProgressData;
    airFilter?: PmTruckProgressData;
    alignment?: PmTruckProgressData | PmTrailerProgressData;
    battery?: PmTruckProgressData;
    belts?: PmTruckProgressData;
    brakeChamber?: PmTruckProgressData;
    engTuneUp?: PmTruckProgressData;
    fuelPump?: PmTruckProgressData;
    oilFilter?: PmTruckProgressData;
    oilPump?: PmTruckProgressData;
    radiator?: PmTruckProgressData;
    transFluid?: PmTruckProgressData;
    turbo?: PmTruckProgressData;
    waterPump?: PmTruckProgressData;
    general?: PmTrailerProgressData;
    ptoPump?: PmTrailerProgressData;
    reeferUnit?: PmTrailerProgressData;
    truck?: TruckMinimalResponse;
    trailer?: TrailerMinimalResponse;
    pmId?: number;
    businessName?: string;
    billingAddress?: Address;
    address?: Address;
    fullName?: string;
}

export interface PmTruckProgressData {
    expirationMiles?: number;
    expirationMilesText?: string;
    percentage: number;
    totalValueText: string;
}

export interface PmTrailerProgressData {
    expirationDays?: number;
    expirationDaysText?: string;
    percentage: number;
    totalValueText: string;
}

export interface CreditProgressData {
    expirationCredit?: number;
    expirationCreditText?: string;
    percentage: number;
    totalValueText: string;
}

export interface TableDropdownContent {
    content: DropdownItem[];
    hasContent: boolean;
}

export interface dropdownOpen {
    id: number;
    data: CardDetails;
    type: string;
}

export interface DropdownItem {
    title?: string;
    name?: string;
    svgUrl?: string;
    class?: string;
    mutedStyle?: boolean;
    contentType?: string;
    text?: string;
    svgStyle?: { width: number; height: number };
    svgClass?: string;
    isDropdown?: boolean;
    hasBorder?: boolean;
    isDisabled?: boolean;
    tableListDropdownContentStyle?: { [key: string]: any };
    insideDropdownContent?: InsideDropdownContent[];
    svg?: string;
    show?: boolean;
    iconName?: string;
    type?: string;
    danger?: boolean;
    redIcon?: boolean;
}

interface InsideDropdownContent {
    title: string;
    name: string;
}

export interface BodyActions {
    id: number;
    card: CardDetails;
    type: string;
}

export interface Type {
    name: string;
    id: number;
}
interface LoadTotal {
    total: string;
    subTotal: string;
}
export interface StatusType {
    name: string;
    id: number;
}

export interface Status {
    name: string;
    id: number;
}

export interface LastStatusPassed {
    hours: number;
    minutes: number;
    additionalProp3: number;
    days?: number;
    seconds?: number;
}

export interface Dispatcher {
    id: number;
    fullName: string;
    avatar: string;
    departmentId: number;
}

export interface Company {
    id: number;
    companyName: string;
    logo: string;
    isDivision: boolean;
    isActive: boolean;
    lastLogin: string;
}

export interface Dispatch {
    id: number;
    dispatchBoardId: number;
    dispatcherId: number;
    truck: Truck;
    trailer: Trailer;
    driver: Driver;
    coDriver: CoDriver;
}

export interface Truck {
    id: number;
    truckNumber: string;
    status: number;
    owner: string;
    color: Color;
    truckType: TruckType;
}

export interface Color {
    id: number;
    companyId: number;
    name: string;
    code: string;
}

export interface TruckType {
    id: number;
    companyId: number;
    name: string;
    logoName: string;
}

export interface Trailer {
    id: number;
    trailerNumber: string;
    status: number;
    owner: string;
    trailerType: TrailerType;
}

export interface TrailerType {
    id: number;
    companyId: number;
    name: string;
    logoName: string;
    hasVolume: boolean;
}

export interface Driver {
    id: number;
    firstName: string;
    lastName: string;
    owner: number;
    status: number;
    avatar: string;
}

export interface CoDriver {
    id: number;
    firstName: string;
    lastName: string;
    owner: number;
    status: number;
    avatar: string;
}

export interface Broker {
    id: number;
    businessName: string;
    availableCredit: number;
    availableCreditType: AvailableCreditType;
    payTerm: PayTerm;
    dnu: boolean;
    ban: boolean;
}

export interface AvailableCreditType {
    name: string;
    id: number;
}

export interface PayTerm {
    name: string;
    id: number;
}

export interface BrokerContact {
    id: number;
    brokerId: number;
    email: string;
    phone: string;
    contactName: string;
    department: Department;
    extensionPhone: string;
}

export interface Department {
    id: number;
    name: string;
}

export interface GeneralCommodity {
    name: string;
    id: number;
}

export interface LoadRequirements {
    id: number;
    truckType: TruckType2;
    trailerType: TrailerType2;
    doorType: DoorType;
    suspension: Suspension;
    trailerLength: TrailerLength;
    year: number;
    liftgate: boolean;
    driverMessage: string;
}

export interface TruckType2 {
    id: number;
    companyId: number;
    name: string;
    logoName: string;
}

export interface TrailerType2 {
    id: number;
    companyId: number;
    name: string;
    logoName: string;
    hasVolume: boolean;
}

export interface DoorType {
    name: string;
    id: number;
}

export interface Suspension {
    name: string;
    id: number;
}

export interface TrailerLength {
    id: number;
    companyId: number;
    name: string;
}

export interface Stop {
    id: number;
    stopType: StopType;
    stopOrder: number;
    stopLoadOrder: number;
    shipper: Shipper;
    shipperContact: ShipperContact;
    dateFrom: string;
    dateTo: string;
    timeType: TimeType;
    timeFrom: string;
    timeTo: string;
    arrive: string;
    depart: string;
    wait: Wait;
    items: Item[];
    milesType: MilesType;
    legMiles: number;
    legHours: number;
    legMinutes: number;
    shape: string;
}

export interface StopType {
    name: string;
    id: number;
}

export interface Shipper {
    id: number;
    businessName: string;
    address: Address;
    longitude: number;
    latitude: number;
}

export interface Address {
    city: string;
    state: string;
    county: string;
    address: string;
    street: string;
    streetNumber: string;
    country: string;
    zipCode: string;
    stateShortName: string;
    addressUnit: string;
}

export interface ShipperContact {
    id: number;
    shipperId: number;
    phone: string;
    contactName: string;
    extensionPhone: string;
}

export interface TimeType {
    name: string;
    id: number;
}

export interface Wait {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
}

export interface Item {
    id: number;
    bolNumber: string;
    appointmentNumber: string;
    pickupNumber: string;
    poNumber: string;
    sealNumber: string;
    weight: number;
    length: number;
    height: number;
    temperature: number;
    description: string;
    code: string;
    quantity: number;
    units: Units;
    secure: Secure;
    tarp: Tarp;
    stackable: Stackable;
    driverAssist: DriverAssist;
    hazardousMaterial: HazardousMaterial;
}

export interface Units {
    name: string;
    id: number;
}

export interface Secure {
    name: string;
    id: number;
}

export interface Tarp {
    name: string;
    id: number;
}

export interface Stackable {
    name: string;
    id: number;
}

export interface DriverAssist {
    name: string;
    id: number;
}

export interface HazardousMaterial {
    id: number;
    class: number;
    division: number;
    group: string;
    description: string;
    notes: string;
    logoName: string;
}

export interface MilesType {
    name: string;
    id: number;
}

export interface SplitLoad {
    id: number;
    previousStopOrder: number;
    nextStopOrder: number;
    splitDate: string;
    splitTime: string;
    splitLocation: SplitLocation;
    newDispatch: NewDispatch;
    rateFirstLoad: number;
    rateSecondLoad: number;
    firstLegMiles: number;
    secondLegMiles: number;
    createdAt: string;
    updatedAt: string;
}

export interface SplitLocation {
    city: string;
    state: string;
    county: string;
    address: string;
    street: string;
    streetNumber: string;
    country: string;
    zipCode: string;
    stateShortName: string;
    addressUnit: string;
}

export interface NewDispatch {
    id: number;
    dispatchBoardId: number;
    dispatcherId: number;
    truck: Truck2;
    trailer: Trailer2;
    driver: Driver2;
    coDriver: CoDriver2;
}

export interface Truck2 {
    id: number;
    truckNumber: string;
    status: number;
    owner: string;
    color: Color2;
    truckType: TruckType3;
}

export interface Color2 {
    id: number;
    companyId: number;
    name: string;
    code: string;
}

export interface TruckType3 {
    id: number;
    companyId: number;
    name: string;
    logoName: string;
}

export interface Trailer2 {
    id: number;
    trailerNumber: string;
    status: number;
    owner: string;
    trailerType: TrailerType3;
}

export interface TrailerType3 {
    id: number;
    companyId: number;
    name: string;
    logoName: string;
    hasVolume: boolean;
}

export interface Driver2 {
    id: number;
    firstName: string;
    lastName: string;
    owner: number;
    status: number;
    avatar: string;
}

export interface CoDriver2 {
    id: number;
    firstName: string;
    lastName: string;
    owner: number;
    status: number;
    avatar: string;
}

export interface AdditionalBillingRate {
    id: number;
    additionalBillingType: AdditionalBillingType;
    rate: number;
}

export interface AdditionalBillingType {
    name: string;
    id: number;
}

export interface Pay {
    id: number;
    paymentType: PaymentType;
    pay: number;
    payDate: string;
}

export interface PaymentType {
    name: string;
    id: number;
}

export interface StatusHistory {
    status: Status2;
    updatedAt: string;
}

export interface Status2 {
    name: string;
    id: number;
}

export interface Comment {
    id?: number;
    companyUser?: CompanyUser;
    entityTypeComment?: EntityTypeComment;
    commentContent?: string;
    downRatingCount?: number;
    upRatingCount?: number;
    currentCompanyUserRating?: number;
    createdAt?: string;
    updatedAt?: string;
    userAvatar?: string;
    fullName?: string;
    avatarColor?: {
        background?: string;
        color?: string;
    };
    cardId?: number;
    textShortName?: string;
    date?: string;
    edited?: boolean;
    comment?: string;
    isOpen?: boolean;
    entityTypeId?: number;
}

export interface DeleteComment {
    entityTypeId: number;
    commentId: number;
}
export interface CompanyUser {
    id?: number;
    fullName?: string;
    avatar?: string;
    departmentId?: number;
}

export interface EntityTypeComment {
    name: string;
    id: number;
}

export interface TotalLoadTime {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
}

export interface FirstPickupTime {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
}

export interface LastDeliveryTime {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
}

export interface CurrentLocation {
    city: string;
    state: string;
    county: string;
    address: string;
    street: string;
    streetNumber: string;
    country: string;
    zipCode: string;
    stateShortName: string;
    addressUnit: string;
}

export interface NextStop {
    id: number;
    stopType: StopType2;
    stopOrder: number;
    stopLoadOrder: number;
    shipper: Shipper2;
    shipperContact: ShipperContact2;
    dateFrom: string;
    dateTo: string;
    timeType: TimeType2;
    timeFrom: string;
    timeTo: string;
    arrive: string;
    depart: string;
    wait: Wait2;
    items: Item2[];
    milesType: MilesType2;
    legMiles: number;
    legHours: number;
    legMinutes: number;
    shape: string;
}

export interface StopType2 {
    name: string;
    id: number;
}

export interface Shipper2 {
    id: number;
    businessName: string;
    address: Address2;
    longitude: number;
    latitude: number;
}

export interface Address2 {
    city: string;
    state: string;
    county: string;
    address: string;
    street: string;
    streetNumber: string;
    country: string;
    zipCode: string;
    stateShortName: string;
    addressUnit: string;
}

export interface ShipperContact2 {
    id: number;
    shipperId: number;
    phone: string;
    contactName: string;
    extensionPhone: string;
}

export interface TimeType2 {
    name: string;
    id: number;
}

export interface Wait2 {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
}

export interface Item2 {
    id: number;
    bolNumber: string;
    appointmentNumber: string;
    pickupNumber: string;
    poNumber: string;
    sealNumber: string;
    weight: number;
    length: number;
    height: number;
    temperature: number;
    description: string;
    code: string;
    quantity: number;
    units: Units2;
    secure: Secure2;
    tarp: Tarp2;
    stackable: Stackable2;
    driverAssist: DriverAssist2;
    hazardousMaterial: HazardousMaterial2;
}

export interface Units2 {
    name: string;
    id: number;
}

export interface Secure2 {
    name: string;
    id: number;
}

export interface Tarp2 {
    name: string;
    id: number;
}

export interface Stackable2 {
    name: string;
    id: number;
}

export interface DriverAssist2 {
    name: string;
    id: number;
}

export interface HazardousMaterial2 {
    id: number;
    class: number;
    division: number;
    group: string;
    description: string;
    notes: string;
    logoName: string;
}

export interface MilesType2 {
    name: string;
    id: number;
}

export interface ProgressBar {
    loadStopId: number;
    stopType: StopType3;
    totalLegMiles: number;
    progressBarPercentage: number;
}

export interface StopType3 {
    name: string;
    id: number;
}

export interface File {
    fileId: number;
    fileName: string;
    url: string;
    fileSize: number;
    tags: string[];
    tagGeneratedByUser: boolean;
}
