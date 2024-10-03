import { AddressEntity } from 'appcoretruckassist';

export interface DriverModel {
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
    address: Address;
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
    userType?: UserType;
}

interface Owner {
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
    address: AddressEntity;
    files: File[];
    fileCount: number;
    createdAt: string;
    updatedAt: string;
}

interface OwnerType {
    name: string;
    id: number;
}

interface Bank {
    id: number;
    name: string;
    logoName: string;
    createdAt: string;
    updatedAt: string;
}

interface File {
    fileId: number;
    fileName: string;
    url: string;
    fileSize: number;
    tags: string[];
    tagGeneratedByUser: boolean;
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

interface Bank2 {
    id: number;
    name: string;
    logoName: string;
    createdAt: string;
    updatedAt: string;
}

interface PayType {
    name: string;
    id: number;
}

interface Solo {
    emptyMile: number;
    loadedMile: number;
    perStop: number;
}

interface Team {
    emptyMile: number;
    loadedMile: number;
    perStop: number;
}

interface FleetType {
    name: string;
    id: number;
}

interface EmploymentHistory {
    id: number;
    startDate: string;
    endDate: string;
    isDeactivate: boolean;
    duration: Duration;
    createdAt: string;
    updatedAt: string;
}

interface Duration {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
}

interface OffDutyLocation {
    id: number;
    nickname: string;
    address: Address3;
    createdAt: string;
    updatedAt: string;
}

interface Address3 {
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

interface File2 {
    fileId: number;
    fileName: string;
    url: string;
    fileSize: number;
    tags: string[];
    tagGeneratedByUser: boolean;
}

interface AssignedTo {
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
    truckType: TruckType2;
}

interface Color2 {
    id: number;
    companyId: number;
    name: string;
    code: string;
}

interface TruckType2 {
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
    trailerType: TrailerType2;
}

interface TrailerType2 {
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

interface GeneralNotifications {
    mailNotification: string;
    pushNotification: string;
    smsNotification: string;
}

interface UserType {
    id: number;
    name: string;
}