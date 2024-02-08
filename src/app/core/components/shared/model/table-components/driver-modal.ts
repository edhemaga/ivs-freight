import { DropdownItem } from '../card-table-data';

export interface DriverModal {
    id: number;
    owner: Owner;
    firstName: string;
    fullName: string;
    lastName: string;
    phone: string;
    email: string;
    ssn: string;
    status: number;
    note: string;
    tableInvited: string;
    invitedDate: string;
    acceptedDate: string;
    mvrExpiration: number;
    address: Address2;
    dateOfBirth: string;
    dateTerminated: string;
    doB: string;
    bank: Bank2;
    account: string;
    routing: string;
    useTruckAssistAch: boolean;
    payType: PayType;
    solo: Solo;
    team: Team;
    fleetType: FleetType;
    soloDriver: boolean;
    teamDriver: boolean;
    perMileSolo: number;
    perMileTeam: number;
    commissionSolo: number;
    commissionTeam: number;
    soloFlatRate: number;
    teamFlatRate: number;
    hired: string;
    avatar: string;
    twic: boolean;
    twicExpDate: string;
    fuelCard: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelationship: string;
    general: GeneralNotifications;
    payroll: GeneralNotifications;
    employmentHistories: EmploymentHistory[];
    offDutyLocations: OffDutyLocation[];
    mvrExpirationDays: number;
    cdlExpirationDays: number;
    medicalExpirationDays: number;
    mvrExpirationHours: number;
    cdlExpirationHours: number;
    medicalExpirationHours: number;
    mvrPercentage: number;
    cdlPercentage: number;
    medicalPercentage: number;
    dispatches: Dispatch[];
    files: File2[];
    filesCountForList: number;
    assignedTo: AssignedTo;
    createdAt: string;
    updatedAt: string;
    actionAnimation: string;
    applicationStatus: string;
    mvrStatus: string;
    pspStatus: string;
    sphStatus: string;
    hosStatus: string;
    ssnStatus: string;
    medicalDaysLeft: string;
    cdlDaysLeft: string;
}

export interface Owner {
    id: number;
    name: string;
    ownerType: OwnerType;
    trailerCount: number;
    truckCount: number;
    ssnEin: string;
    phone: string;
    email: string;
    note: string;
    bank: Bank;
    accountNumber: string;
    routingNumber: string;
    address: Address;
    files: File[];
    fileCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface OwnerType {
    name: string;
    id: number;
}

export interface Bank {
    id: number;
    name: string;
    logoName: string;
    createdAt: string;
    updatedAt: string;
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

export interface File {
    fileId: number;
    fileName: string;
    url: string;
    fileSize: number;
    tags: string[];
    tagGeneratedByUser: boolean;
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

export interface Bank2 {
    id: number;
    name: string;
    logoName: string;
    createdAt: string;
    updatedAt: string;
}

export interface PayType {
    name: string;
    id: number;
}

export interface Solo {
    emptyMile: number;
    loadedMile: number;
    perStop: number;
}

export interface Team {
    emptyMile: number;
    loadedMile: number;
    perStop: number;
}

export interface FleetType {
    name: string;
    id: number;
}

export interface EmploymentHistory {
    id: number;
    startDate: string;
    endDate: string;
    isDeactivate: boolean;
    duration: Duration;
    createdAt: string;
    updatedAt: string;
}

export interface Duration {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
}

export interface OffDutyLocation {
    id: number;
    nickname: string;
    address: Address3;
    createdAt: string;
    updatedAt: string;
}

export interface Address3 {
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

export interface File2 {
    fileId: number;
    fileName: string;
    url: string;
    fileSize: number;
    tags: string[];
    tagGeneratedByUser: boolean;
}

export interface AssignedTo {
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
    truckType: TruckType2;
}

export interface Color2 {
    id: number;
    companyId: number;
    name: string;
    code: string;
}

export interface TruckType2 {
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
    trailerType: TrailerType2;
}

export interface TrailerType2 {
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

export interface FilterOptionApplicant {
    applicantSpecParamsArchived: boolean;
    applicantSpecParamsHired: boolean;
    applicantSpecParamsFavourite: boolean;
    applicantSpecParamsPageIndex: number;
    applicantSpecParamsPageSize: number;
    applicantSpecParamsCompanyId: number;
    applicantSpecParamsSort: string;
    searchOne: string;
    searchTwo: string;
    searchThree: string;
}

export interface FilterOptionDriver {
    active: number;
    long: number;
    lat: number;
    distance: number;
    pageIndex: number;
    pageSize: number;
    companyId: number;
    sort: string;
    searchOne: string;
    searchTwo: string;
    searchThree: string;
}

export interface OnTableHeadActionsModal {
    action: string;
    direction: string;
}

export interface OnTableBodyActionsModal {
    data?: DriverModal;
    id?: number;
    type: string;
}
export interface AvatarColors {
    background: string;
    color: string;
}

export interface MappedApplicantData {
    isSelected: boolean;
    invitedDate?: string | null;
    acceptedDate: string;
    doB: string;
    applicationStatus: string;
    mvrStatus: string;
    pspStatus: string;
    sphStatus: string;
    hosStatus: string;
    ssnStatus: string;
    medicalDaysLeft: number;
    medicalPercentage: number;
    cdlDaysLeft: number;
    cdlPercentage: number;
}

interface GeneralNotifications {
    mailNotification: string;
    pushNotification: string;
    smsNotification: string;
}

export interface MappedApplicantData {
    tableInvited: string;
    isSelected: boolean;
    tableAccepted: string | null;
    tableDOB: string | null;
    tableApplicantProgress: {
        title: string;
        status: string | null;
        width: number;
        class: string;
        percentage: number;
    }[];
    tableMedical: {
        class: string;
        hideProgres: boolean;
        isApplicant: boolean;
        expirationDays: string | null;
        percentage: number | null;
    };
    tableCdl: {
        class: string;
        hideProgres: boolean;
        isApplicant: boolean;
        expirationDays: string | null;
        percentage: number | null;
    };
    tableRev: {
        title: string;
        iconLink: string;
    };
    hire: boolean;
    isFavorite: boolean;
    tableDropdownContent: {
        hasContent: boolean;
        content: DropdownItem[];
    };
}
