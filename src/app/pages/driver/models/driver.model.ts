export interface Driver {
    id: number;
    companyId: number;
    fullName: string;
    driverUserId: number;
    dob: string;
    ownerId?: any;
    app: number;
    mvr: number;
    psp: number;
    ssnApplicant: number;
    rev: boolean;
    sph: number;
    medical: Medical;
    cdl: CDL;
    email: string;
    ssn: string;
    dateOdobfBirth?: any;
    password?: any;
    avatar: string;
    firstName: string;
    lastName: string;
    phone: string;
    additionalData: Additional;
    workData: Work;
    licenseData: License[];
    medicalData: Medical[];
    mvrData: MVR[];
    bankId?: any;
    accountNumber?: any;
    routingNumber?: any;
    deviceId?: any;
    uniqueId?: any;
    paymentTypeId?: any;
    paymentType?: any;
    commission: number;
    emptyMiles?: any;
    loadedMiles?: any;
    isOwner: number;
    isOwnerAsCompany: number;
    commissionOwner?: any;
    twic: number;
    expirationDate?: any;
    cardNumber?: any;
    cardId?: any;
    status: number;
    used: number;
    doc: any;
    protected: number;
    createdAt: string;
    updatedAt: string;
    gpsFlag: any;
    truckload: any;
    owner: any;
    driverUser: any;
    guid: string;
    textPhone: string;
    textEmail: string;
    textAddress: string;
    textDOB: string;
    textHired: string;
    textState: string;
    textCDL: string;
    textBank: any;
    textAccount: any;
    textRouting: any;
    bankImage: any;
    restrictions?: any;
    endorsements: Endorsement[];
    tableCDLData: CDL;
    tableMedicalData: Medical;
    tableMvrData: MVR;
    isSelected: boolean;
}

interface Medical {
    id?: string;
    end: string;
    start: string;
    attachments?: Attachment[];
}

interface MVR {
    id?: string;
    startDate: string;
    attachments?: Attachment[];
}

interface CDL {
    id?: string;
    end: string;
    start: string;
}

interface Avatar {
    id: string;
    src: string;
}

interface Address {
    city: string;
    state: string;
    address: string;
    country: string;
    zipCode: string;
    streetName: string;
    addressUnit?: any;
    streetNumber: string;
    stateShortName: string;
}

interface Bank {
    id?: any;
    bankLogo?: any;
    bankName?: any;
    bankLogoWide?: any;
    accountNumber?: any;
    routingNumber?: any;
}

interface Bussiness {
    taxId?: any;
    isOwner: number;
    businessName?: any;
    isBusinessOwner: number;
}

interface Work {
    id: string;
    endDate: string;
    startDate: string;
    endDateShort?: any;
    startDateShort: string;
}

interface Class {
    id: number;
    key: string;
    value: string;
    domain: string;
    entityId?: any;
    parentId?: any;
    companyId: number;
    createdAt: string;
    protected: number;
    updatedAt: string;
    entityName?: any;
}

interface State {
    key: string;
    value: string;
}

interface Country {
    id: number;
    key: string;
    value: string;
    domain: string;
    entityId?: any;
    parentId?: any;
    companyId: number;
    createdAt: string;
    protected: number;
    updatedAt: string;
    entityName?: any;
}

interface Attachment {
    url: string;
    fileName: string;
    fileItemGuid: string;
}

interface Endorsement {
    id: number;
    domain?: any;
    protected?: any;
    endorsementCode: string;
    endorsementName: string;
}

interface Additional {
    note?: any;
    type: string;
    email: string;
    phone: string;
    avatar: Avatar;
    address: Address;
    bankData: Bank;
    dateOfBirth: string;
    paymentType: any;
    businessData: Bussiness;
    notifications: any[];
    birthDateShort: string;
}

interface License {
    id: string;
    note?: any;
    class: Class;
    state: State;
    number: string;
    country: Country;
    endDate: string;
    startDate: string;
    attachments: Attachment[];
    endorsements: Endorsement[];
    restrictions: any;
}
