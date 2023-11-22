export interface LoadDetails {
    additionalBillingRates: BillingRate[];
    additionalBillingRatesTotal: number;
    adjustedRate: null | number;
    advancePay: null | number;
    age: null | number;
    baseRate: number;
    broker: Broker;
    brokerContact: null | any;
    company: Company;
    dispatcher: Dispatcher;
    firstPickupTime: FirstPickupTime;
    stops: Stop[];
    lastDeliveryTime: any;
    lastStatusPassed: LastStatusPassed;
    loadBroker: LoadBroker;
    loadComment: LoadComment[];
    loadDelivery: LoadDelivery;
    loadDispatcher: LoadDispatcher;
    loadInvoice: LoadInvoice;
    loadPickup: LoadPickup;
    loadStatus: LoadStatus;
    loadTotal: LoadTotal;
    loadTrailerNumber: LoadTrailerNumber;
    loadTruckNumber: LoadTruckNumber;
    nextStop: NextStop;
    pays: any[];
    status: Status;
    statusHistory: StatusHistory[];
    statusType: StatusType;
    tableDropdownContent: TableDropDownContent;
    closedPercentage: null | number;
    comments: null;
    commentsCount: number;
    completedPercentage: number;
    createdAt: string;
    currentLocation: null;
    dateCreated: string;
    daysToPay: null;
    dispatch: null;
    driverRate: null;
    fileCount: null;
    files: null;
    generalCommodity: null;
    id: number;
    invoicedDate: null;
    isSelected: boolean;
    loadNumber: string;
    loadedMiles: number;
    note: null;
    paidDate: null;
    pendingPercentage: number;
    progressBar: null;
    referenceNumber: string;
    revisedRate: null;
    shortPaid: null;
    splitLoad: null;
    tableAttachments: any[];
    textAdditional: string;
    textAdvance: string;
    textBase: string;
    textCommodity: string;
    textDriver: string;
    textMiles: string;
    textPayTerms: string;
    textWeight: string;
    tonuRate: null;
    totalAdjustedRate: null;
    totalDue: number;
    totalLoadTime: any;
    totalMiles: number;
    totalPaid: number;
    totalRate: number;
    totalTimeDays: number;
    totalTimeHours: number;
    type: { name: string; id: number };
    updatedAt: string;
    weight: null;
}

interface BillingRate {
    additionalBillingType: {
        id: number;
        name: string;
    };
    id: number;
    rate: number;
}
interface AvailableCreditType {
    id: number;
    name: string;
}
interface Broker {
    availableCredit: number;
    availableCreditType: AvailableCreditType;
    ban: boolean;
    businessName: string;
    dnu: boolean;
    id: number;
    payTerm: null | any;
}

interface Company {
    id: number;
    isDivision: boolean;
    isActive: boolean;
    companyName: string;
    logo: string;
    lastLogin: null | string;
}
interface FirstPickupTime {
    days: number;
    hours: number;
    minutes: number;
}
interface Dispatcher {
    id: number;
    fullName: string;
    avatar: string | null;
    departmentId: number;
}
interface LastStatusPassed {
    days: number;
    hours: number;
    minutes: number;
}
interface LoadBroker {
    hasBanDnu: boolean;
    isDnu: boolean;
    name: string;
}
interface LoadComment {
    comments: any[];
    count: string;
}
interface LoadDelivery {
    count: number;
    date: string;
    location: string;
    time: string;
}
interface LoadDispatcher {
    avatar: string;
    name: string;
}
interface LoadInvoice {
    invoice: string;
    type: string;
}
interface LoadPickup {
    count: number;
    date: string;
    location: string;
    time: string;
}
interface LoadStatus {
    color: string;
    status: string;
    time: string;
}
interface LoadTotal {
    subTotal: string;
    total: string;
}
interface LoadTrailerNumber {
    color: string;
    number: string;
}
interface LoadTruckNumber {
    color: string;
    number: string;
}
interface Address {
    address: string;
    addressUnit: null | string;
    city: string;
    country: string;
    county: string;
    state: string;
    stateShortName: string;
    street: string;
    streetNumber: string;
    zipCode: string;
}

interface Shipper {
    id: number;
    businessName: string;
    address: Address;
    longitude: number;
    latitude: number;
}

interface MilesType {
    name: string;
    id: number;
}

interface StopType {
    name: string;
    id: number;
}

interface TimeType {
    name: string;
    id: number;
}
interface NextStop {
    arrive: null | any;
    dateFrom: string;
    dateTo: null | any;
    depart: null | any;
    id: number;
    items: any[];
    legHours: number;
    legMiles: number;
    legMinutes: number;
    milesType: MilesType;
    shape: null | any;
    shipper: Shipper;
    shipperContact: null | any;
    stopLoadOrder: number;
    stopOrder: number;
    stopType: StopType;
    timeFrom: string;
    timeTo: string;
    timeType: TimeType;
    wait: {};
}
interface Status {
    id: number;
    name: string;
}
interface StatusHistory {
    status: Status;
    updatedAt: string;
}
interface StatusType {
    id: number;
    name: string;
}
interface Stop {
    arrive: null | string;
    dateFrom: string | null;
    dateTo: string | null;
    depart: null | string;
    id: number;
    items: any[];
    legHours: number;
    legMiles: number;
    legMinutes: number;
    milesType: Status;
    shape: null | any;
    shipper: Shipper;
    shipperContact: null | any;
    stopLoadOrder: number;
    stopOrder: number;
    stopType: Status;
    timeFrom: string;
    timeTo: string;
    timeType: Status;
    wait: {};
}
interface SvgStyle {
    width: number;
    height: number;
}
interface Content {
    hasBorder: boolean;
    name: string;
    SvgClass: string;
    svgStyle: SvgStyle;
    svgUrl: string;
    title: string;
}
interface TableDropDownContent {
    content: Content[];
}

// Table rows
interface GridColumn {
    avatar: null | any;
    disabled: boolean;
    export: boolean;
    field: string;
    filter: string;
    filterable: boolean;
    hidden: boolean;
    hoverTemplate: null | any;
    index: number;
    isActionColumn: boolean;
    isNumeric: boolean;
    isSelectColumn: boolean;
    name: string;
    ngTemplate: string;
    progress: null | any;
    resizable: boolean;
    sortable: boolean;
    title: string;
    width: number;
}
export interface LoadTableData {
    extended: boolean;
    field: string;
    gridColumns: GridColumn[];
    gridNameTitle: string;
    isActive: boolean;
    length: number;
    stateName: string;
    tableConfiguration: string;
    title: string;
}
