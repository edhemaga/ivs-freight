import { SafeResourceUrl } from '@angular/platform-browser';
import { DropdownItem } from 'src/app/shared/models/dropdown-item.model';
import { LoadBroker } from 'src/app/shared/models/load-broker.model';

export interface LoadModel {
    isSelected: boolean;
    id: number;
    type: Type;
    loadNumber: string;
    loadInvoice: LoadInvoice;
    statusType: StatusType;
    status: Status;
    lastStatusPassed: LastStatusPassed;
    dispatcher: Dispatcher;
    company: Company;
    dateCreated: string;
    dispatch: Dispatch;
    broker: Broker;
    brokerContact: BrokerContact;
    referenceNumber: string;
    generalCommodity: GeneralCommodity;
    weight: number;
    loadRequirements: LoadRequirements;
    loadDispatcher: LoadDispatcher;
    stops: Stop[];
    splitLoad: SplitLoad;
    note: string;
    baseRate: number;
    adjustedRate: number;
    revisedRate: number;
    tonuRate: number;
    driverRate: number;
    additionalBillingRatesTotal: number;
    additionalBillingRates: AdditionalBillingRate[];
    totalRate: number;
    totalAdjustedRate: number;
    advancePay: number;
    pays: Pay[];
    statusHistory: StatusHistory[];
    totalPaid: number;
    totalDue: number;
    loadedMiles: number;
    totalMiles: number;
    totalTimeDays: number;
    totalTimeHours: number;
    paidDate: string;
    invoicedDate: string;
    shortPaid: number;
    age: number;
    daysToPay: number;
    totalLoadTime: TotalLoadTime;
    firstPickupTime: FirstPickupTime;
    lastDeliveryTime: LastDeliveryTime;
    currentLocation: CurrentLocation;
    nextStop: NextStop;
    completedPercentage: number;
    pendingPercentage: number;
    closedPercentage: number;
    progressBar: ProgressBar[];
    createdAt: string;
    updatedAt: string;
    files: File[];
    fileCount: number;
    loadTotal: LoadTotal;
    isFlipped: boolean;
    loadBroker: LoadBroker;
    loadTruckNumber: LoadTruckTrailerNumber;
    loadTrailerNumber: LoadTruckTrailerNumber;
    loadPickup: LoadPickup;
    loadDelivery: LoadDelivery;
    loadStatus: LoadStatus;
    textCommodity: string;
    textMiles: string;
    textWeight: string;
    textBase: string;
    textAdditional: string;
    textAdvance: string;
    textPayTerms: string;
    textDriver: string;
    comments?: Comment[];
    tableAttachments: File[];
    tableDropdownContent: TableDropdownContent;
}

interface TableDropdownContent {
    hasContent: boolean;
    content: DropdownItem[];
}
interface LoadStatus {
    status: string;
    color: string;
    time: string;
}
interface LoadTotal {
    total: string;
    subTotal: string;
}

interface LoadStatus {
    status: string;
    color: string;
    time: string;
}
interface LoadDelivery {
    count: string | number;
    location: string;
    date: string;
    time: string;
}

interface LoadPickup {
    count: number;
    location: string;
    date: string;
    time: string;
}

interface LoadTruckTrailerNumber {
    number: string;
    color: string;
}

interface LoadDispatcher {
    name: string;
    avatar: string | SafeResourceUrl;
}

interface LoadInvoice {
    invoice: string;
    type: string;
}

interface Type {
    name: string;
    id: number;
}

interface StatusType {
    name: string;
    id: number;
}

interface Status {
    name: string;
    id: number;
}

interface LastStatusPassed {
    hours: number;
    minutes: number;
    additionalProp3: number;
}

interface Dispatcher {
    id: number;
    fullName: string;
    avatar: string;
    departmentId: number;
}

interface Company {
    id: number;
    companyName: string;
    logo: string;
    isDivision: boolean;
    isActive: boolean;
    lastLogin: string;
}

interface Dispatch {
    id: number;
    dispatchBoardId: number;
    dispatcherId: number;
    truck: Truck;
    trailer: Trailer;
    driver: Driver;
    coDriver: CoDriver;
}

interface Truck {
    id: number;
    truckNumber: string;
    status: number;
    owner: string;
    color: Color;
    truckType: TruckType;
}

interface Color {
    id: number;
    companyId: number;
    name: string;
    code: string;
}

interface TruckType {
    id: number;
    companyId: number;
    name: string;
    logoName: string;
}

interface Trailer {
    id: number;
    trailerNumber: string;
    status: number;
    owner: string;
    trailerType: TrailerType;
}

interface TrailerType {
    id: number;
    companyId: number;
    name: string;
    logoName: string;
    hasVolume: boolean;
}

interface Driver {
    id: number;
    firstName: string;
    lastName: string;
    owner: number;
    status: number;
    avatar: string;
}

interface CoDriver {
    id: number;
    firstName: string;
    lastName: string;
    owner: number;
    status: number;
    avatar: string;
}

interface Broker {
    id: number;
    businessName: string;
    availableCredit: number;
    availableCreditType: AvailableCreditType;
    payTerm: PayTerm;
    dnu: boolean;
    ban: boolean;
}

interface AvailableCreditType {
    name: string;
    id: number;
}

interface PayTerm {
    name: string;
    id: number;
}

interface BrokerContact {
    id: number;
    brokerId: number;
    email: string;
    phone: string;
    contactName: string;
    department: Department;
    extensionPhone: string;
}

interface Department {
    id: number;
    name: string;
}

interface GeneralCommodity {
    name: string;
    id: number;
}

interface LoadRequirements {
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

interface TruckType2 {
    id: number;
    companyId: number;
    name: string;
    logoName: string;
}

interface TrailerType2 {
    id: number;
    companyId: number;
    name: string;
    logoName: string;
    hasVolume: boolean;
}

interface DoorType {
    name: string;
    id: number;
}

interface Suspension {
    name: string;
    id: number;
}

interface TrailerLength {
    id: number;
    companyId: number;
    name: string;
}

interface Stop {
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

interface StopType {
    name: string;
    id: number;
}

interface Shipper {
    id: number;
    businessName: string;
    address: Address;
    longitude: number;
    latitude: number;
}

interface Address {
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

interface ShipperContact {
    id: number;
    shipperId: number;
    phone: string;
    contactName: string;
    extensionPhone: string;
}

interface TimeType {
    name: string;
    id: number;
}

interface Wait {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
}

interface Item {
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

interface Units {
    name: string;
    id: number;
}

interface Secure {
    name: string;
    id: number;
}

interface Tarp {
    name: string;
    id: number;
}

interface Stackable {
    name: string;
    id: number;
}

interface DriverAssist {
    name: string;
    id: number;
}

interface HazardousMaterial {
    id: number;
    class: number;
    division: number;
    group: string;
    description: string;
    notes: string;
    logoName: string;
}

interface MilesType {
    name: string;
    id: number;
}

interface SplitLoad {
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

interface SplitLocation {
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

interface NewDispatch {
    id: number;
    dispatchBoardId: number;
    dispatcherId: number;
    truck: Truck2;
    trailer: Trailer2;
    driver: Driver2;
    coDriver: CoDriver2;
}

interface Truck2 {
    id: number;
    truckNumber: string;
    status: number;
    owner: string;
    color: Color2;
    truckType: TruckType3;
}

interface Color2 {
    id: number;
    companyId: number;
    name: string;
    code: string;
}

interface TruckType3 {
    id: number;
    companyId: number;
    name: string;
    logoName: string;
}

interface Trailer2 {
    id: number;
    trailerNumber: string;
    status: number;
    owner: string;
    trailerType: TrailerType3;
}

interface TrailerType3 {
    id: number;
    companyId: number;
    name: string;
    logoName: string;
    hasVolume: boolean;
}

interface Driver2 {
    id: number;
    firstName: string;
    lastName: string;
    owner: number;
    status: number;
    avatar: string;
}

interface CoDriver2 {
    id: number;
    firstName: string;
    lastName: string;
    owner: number;
    status: number;
    avatar: string;
}

interface AdditionalBillingRate {
    id: number;
    additionalBillingType: AdditionalBillingType;
    rate: number;
}

interface AdditionalBillingType {
    name: string;
    id: number;
}

interface Pay {
    id: number;
    paymentType: PaymentType;
    pay: number;
    payDate: string;
}

interface PaymentType {
    name: string;
    id: number;
}

interface StatusHistory {
    status: Status2;
    updatedAt: string;
}

interface Status2 {
    name: string;
    id: number;
}

interface Comment {
    avatarColor: {
        background: string;
        color: string;
    };
    id: number;
    companyUser: CompanyUser;
    entityTypeComment: EntityTypeComment;
    commentContent: string;
    downRatingCount: number;
    upRatingCount: number;
    currentCompanyUserRating: number;
    createdAt: string;
    updatedAt: string;
}

interface CompanyUser {
    id: number;
    fullName: string;
    avatar: string;
    departmentId: number;
}

interface EntityTypeComment {
    name: string;
    id: number;
}

interface TotalLoadTime {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
}

interface FirstPickupTime {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
}

interface LastDeliveryTime {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
}

interface CurrentLocation {
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

interface NextStop {
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

interface StopType2 {
    name: string;
    id: number;
}

interface Shipper2 {
    id: number;
    businessName: string;
    address: Address2;
    longitude: number;
    latitude: number;
}

interface Address2 {
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

interface ShipperContact2 {
    id: number;
    shipperId: number;
    phone: string;
    contactName: string;
    extensionPhone: string;
}

interface TimeType2 {
    name: string;
    id: number;
}

interface Wait2 {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
}

interface Item2 {
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

interface Units2 {
    name: string;
    id: number;
}

interface Secure2 {
    name: string;
    id: number;
}

interface Tarp2 {
    name: string;
    id: number;
}

interface Stackable2 {
    name: string;
    id: number;
}

interface DriverAssist2 {
    name: string;
    id: number;
}

interface HazardousMaterial2 {
    id: number;
    class: number;
    division: number;
    group: string;
    description: string;
    notes: string;
    logoName: string;
}

interface MilesType2 {
    name: string;
    id: number;
}

interface ProgressBar {
    loadStopId: number;
    stopType: StopType3;
    totalLegMiles: number;
    progressBarPercentage: number;
}

interface StopType3 {
    name: string;
    id: number;
}

interface File {
    fileId: number;
    fileName: string;
    url: string;
    fileSize: number;
    tags: string[];
    tagGeneratedByUser: boolean;
}
