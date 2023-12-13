import {
    AddressEntity,
    BankResponse,
    BrokerContactResponse,
    BrokerShortResponse,
    ColorResponse,
    CommentResponse,
    CompanyAccountLabelResponse,
    CompanyOfficeShortResponse,
    CompanyShortResponse,
    CompanyUserShortResponse,
    ContactColorResponse,
    CreateContactEmailCommand,
    CreateContactPhoneCommand,
    DepartmentResponse,
    DispatchResponse,
    DispatchShortResponse,
    DriverMinimalResponse,
    EnumValue,
    FileResponse,
    FuelItemResponse,
    FuelStopFranchiseMinimalResponse,
    FuelStopShortResponse,
    FuelTransactionResponse,
    InvoiceAgeingResponse,
    LoadBillingAdditionalResponse,
    LoadPaymentPayResponse,
    LoadRequirementsResponse,
    LoadStatusHistoryResponse,
    LoadStopProgressBarResponse,
    LoadStopResponse,
    NotificationEntity,
    OwnerShortResponse,
    PerMileEntity,
    PoBoxEntity,
    RepairItemResponse,
    RepairServiceTypeResponse,
    RepairShopShortResponse,
    ReviewResponse,
    ShipperContactResponse,
    SplitLoadResponse,
    TimeOnly,
    TireSizeResponse,
    TrailerLengthResponse,
    TrailerMakeResponse,
    TrailerMinimalResponse,
    TrailerTypeResponse,
    TruckEngineModelResponse,
    TruckGrossWeightResponse,
    TruckMakeResponse,
    TruckMinimalResponse,
    TruckTypeResponse,
} from 'appcoretruckassist';
import { LoadResponse } from './load';

export interface tableBodyColumns {
    ngTemplate?: string;
    title?: string;
    field?: string;
    name?: string;
    hidden?: boolean;
    isNumeric?: boolean;
    sortable?: boolean;
    isActionColumn?: boolean;
    isSelectColumn?: boolean;
    filterable?: boolean;
    disabled?: boolean;
    export?: boolean;
    resizable?: boolean;
    filter?: string;
    width?: number;
    index?: number;
    fontWeight?: string;
    minWidth?: number;
    hoverTemplate?: any;
    thSetCenter?: boolean;
    sortName?: string;
    isPined?: boolean;
    groupName?: string;
    headAlign?: string;
    setCenter?: boolean;
    addFontToTableText?: boolean;
    moveRight?: boolean;
    isAction?: boolean;
    isDate?: boolean;
    class?: string;
    showQTY?: boolean;
    showFuelDropDown?: boolean;
    isComputed?: boolean;
    isRound?: boolean;
    showLabel?: boolean;
    link?: tableBodyColumnsLink | null;
    pdfWidth?: number;
    svg?: boolean;
    showPin?: boolean;
    password?: boolean;
    headIconStyle?: tableBodyColumnsheadIconStyle | null;
    svgUrl?: string;
    classField?: string;
    fieldPercentage?: string;
    svgDimensions?: tableBodyColumnsSvgDimensions | null;
    objectIn?: boolean;
    specialColumn?: boolean;
    navigateTo?: boolean;
    opacityIgnore?: boolean;
    imageHover?: tableBodyColumnsImageHover | null;
    linkField?: tableBodyColumnsLink | boolean;
    colorTemplate?: tableBodyColumnsColorTemplate | boolean;
    avatar?: tableBodyColumnsAvatar | boolean;
    progress?: tableBodyColumnsProgress | null;
}

export interface toolbarActions {
    showLocationFilter?: boolean;
    showMoneyFilter?: boolean;
    showStateFilter?: boolean;
    showArhiveFilter?: boolean;
    showLabelFilter?: boolean;
    showTruckFilter?: boolean;
    showTrailerFilter?: boolean;
    showDispatchAdd?: boolean;
    showTimeFilter?: boolean;
    showCategoryFuelFilter?: boolean;
    showFuelStopFilter?: boolean;
    showLtlFilter?: boolean;
    showStatusFilter?: boolean;
    showDispatcherFilter?: boolean;
    showTruckTypeFilter?: boolean;
    showTrailerTypeFilter?: boolean;
    showRepairOrderFilter?: boolean;
    showPMFilter?: boolean;
    showCategoryRepairFilter?: boolean;
    showMoneyCount?: boolean;
    showDispatchSettings?: boolean;
    showMapView?: boolean;
    showDriverFilter?: boolean;
    showInjuryFilter?: boolean;
    showTowingFilter?: boolean;
    showSearchBorder?: boolean;
    hideActivationButton?: boolean;
    hideOpenModalButton?: boolean;
    hideWidth?: boolean;
    hideViewMode?: boolean;
    hideDeleteButton?: boolean;
    hideListColumn?: boolean;
    hideMoneySubType?: boolean;
    hideLocationFilter?: boolean;
    hideCartButton?: boolean;
    hideTruckFilter?: boolean;
    hideTrailerFilter?: boolean;
    hideDriverFilter?: boolean;
    hideUnassignedDevicesButton?: boolean;
    hideSearch?: boolean;
    fuelMoneyFilter?: boolean;
    viewModeOptions?: viewModelOption[];
}

export interface tableBodyOptions {
    toolbarActions?: toolbarActions;
    config?: tableBodyOptionsConfig;
    disabledMutedStyle?: null;
    actions?: tableBodyOptionsActions[];
}

export interface tableBodyTableData {
    title?: string;
    field?: string;
    extended?: boolean;
    length?: number;
    gridNameTitle?: string;
    stateName?: string;
    tableConfiguration?: string;
    isActive?: boolean;
    data?: tableBodyView[];
    gridColumns?: tableBodyColumns[];
}

export interface tableBodyOptionsActions {
    title?: string;
    name?: string;
    show?: boolean;
    type?: string;
    text?: string;
    class?: string;
    contentType?: string;
    svg?: string;
    iconName?: string;
    danger?: boolean;
    redIcon?: boolean;
}

export interface tableBodyView {
    isSelected?: boolean;
    trailerType?: TrailerTypeResponse;
    trailerMake?: TrailerMakeResponse;
    trailerLength?: TrailerLengthResponse;
    suspension?: EnumValue;
    doorType?: EnumValue;
    reeferUnit?: EnumValue;
    trailerNumber?: string | null;
    fhwaInspection?: string | null;
    id?: number;
    companyOwned?: boolean;
    truckNumber?: string | null;
    truckType?: TruckTypeResponse;
    vin?: string | null;
    truckMake?: TruckMakeResponse;
    truckLength?: EnumValue;
    model?: string | null;
    year?: number;
    color?: ColorResponse;
    commission?: number | null;
    owner?: OwnerShortResponse;
    note?: string | null;
    status?: number;
    purchaseDate?: string | null;
    purchasePrice?: number | null;
    truckGrossWeight?: TruckGrossWeightResponse;
    emptyWeight?: number | null;
    truckEngineModel?: TruckEngineModelResponse;
    tireSize?: TireSizeResponse;
    fuelTankSize?: number | null;
    brakes?: EnumValue;
    frontWheels?: EnumValue;
    rearWheels?: EnumValue;
    transmissionModel?: string | null;
    fuelType?: EnumValue;
    shifter?: EnumValue;
    axles?: number | null;
    insurancePolicy?: string | null;
    mileage?: number | null;
    wheelBase?: number | null;
    licensePlate?: string | null;
    fhwaExp?: number;
    engineOilType?: EnumValue;
    gearRatio?: EnumValue;
    apUnit?: EnumValue;
    tollTransponder?: EnumValue;
    tollTransponderDeviceNo?: string | null;
    doubleBunk?: boolean | null;
    refrigerator?: boolean | null;
    headacheRack?: boolean | null;
    dashCam?: boolean | null;
    dcInverter?: boolean | null;
    blower?: boolean | null;
    pto?: boolean | null;
    inspectionPercentage?: number | null;
    inspectionExpirationDays?: number | null;
    inspectionExpirationHours?: number | null;
    registrationPercentage?: number | null;
    registrationExpirationDays?: number | null;
    registrationExpirationHours?: number | null;
    fileCount?: number | null;
    createdAt?: string;
    updatedAt?: string;
    firstName?: string | null;
    lastName?: string | null;
    userType?: EnumValue;
    address?: AddressEntity;
    personalPhone?: string | null;
    personalEmail?: string | null;
    department?: DepartmentResponse;
    companyOffice?: CompanyOfficeShortResponse;
    isAdmin?: boolean;
    isUser?: boolean;
    phone?: string | null;
    extensionPhone?: string | null;
    email?: string | null;
    includeInPayroll?: boolean;
    salary?: number | null;
    startDate?: string;
    is1099?: boolean;
    isW_2?: boolean;
    bank?: BankResponse;
    routingNumber?: string | null;
    accountNumber?: string | null;
    paymentType?: EnumValue;
    avatar?: string | null;
    base?: number | null;
    verified?: boolean;
    lastLogin?: string | null;
    companyId?: number;
    repairType?: EnumValue;
    unitType?: EnumValue;
    truckId?: number | null;
    truck?: TruckMinimalResponse;
    trailerId?: number | null;
    trailer?: TrailerMinimalResponse;
    odometer?: number | null;
    date?: string | null;
    repairShop?: RepairShopShortResponse;
    invoice?: string | null;
    total?: number | null;
    serviceTypes?: Array<RepairServiceTypeResponse> | null;
    items?: Array<RepairItemResponse> | null;
    files?: Array<FileResponse> | null;
    name?: string | null;
    url?: string | null;
    username?: string | null;
    password?: string | null;
    companyAccountLabel?: CompanyAccountLabelResponse;
    colorRes?: ContactColorResponse;
    colorLabels?: Array<CompanyAccountLabelResponse>;
    shared?: boolean;
    companyContactLabelId?: CompanyAccountLabelResponse | null;
    contactPhones?: Array<CreateContactPhoneCommand> | null;
    contactEmails?: Array<CreateContactEmailCommand> | null;
    businessName?: string | null;
    dbaName?: string | null;
    mcNumber?: string | null;
    ein?: string | null;
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
    dnu?: boolean;
    ban?: boolean;
    creditType?: EnumValue;
    brokerContacts?: Array<BrokerContactResponse> | null;
    reviews?: Array<ReviewResponse> | null;
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
    loads?: Array<LoadResponse> | null;
    phoneExt?: string | null;
    receivingAppointment?: boolean;
    receivingFrom?: string | null;
    receivingTo?: string | null;
    shippingAppointment?: boolean | null;
    shippingFrom?: string | null;
    shippingTo?: string | null;
    receivingOpenTwentyFourHours?: boolean;
    shippingOpenTwentyFourHours?: boolean;
    shippingHoursSameReceiving?: boolean;
    shipperContacts?: Array<ShipperContactResponse> | null;
    pickups?: number;
    deliveries?: number;
    avgPickupTime?: TimeOnly;
    avgDeliveryTime?: TimeOnly;
    fullName?: string | null;
    ssn?: string | null;
    dateOfBirth?: string | null;
    account?: string | null;
    routing?: string | null;
    useTruckAssistAch?: boolean;
    payType?: EnumValue;
    solo?: PerMileEntity;
    team?: PerMileEntity;
    perMileSolo?: number | null;
    perMileTeam?: number | null;
    commissionSolo?: number | null;
    commissionTeam?: number | null;
    soloFlatRate?: number | null;
    teamFlatRate?: number | null;
    twic?: boolean;
    twicExpirationDays?: number | null;
    fuelCard?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    emergencyContactRelationship?: string | null;
    general?: NotificationEntity;
    payroll?: NotificationEntity;
    cdlNumber?: string | null;
    licenseStateShortName?: string | null;
    hired?: string | null;
    mvrExpirationDays?: number | null;
    mvrExpirationHours?: number | null;
    cdlExpirationHours?: number | null;
    medicalExpirationHours?: number | null;
    cdlExpirationDays?: number | null;
    medicalExpirationDays?: number | null;
    mvrPercentage?: number | null;
    cdlPercentage?: number | null;
    medicalPercentage?: number | null;
    dispatcher?: CompanyUserShortResponse;
    dispatches?: Array<DispatchResponse> | null;
    teamBoard?: boolean;
    dispatchCount?: number;
    truckCount?: number;
    trailerCount?: number;
    driverCount?: number;
    driver?: DriverMinimalResponse;
    fuelStopStore?: FuelStopShortResponse;
    transactionDate?: string;
    apiTransactionId?: number | null;
    timezoneOffset?: number | null;
    supplierId?: number | null;
    fuelTransactionType?: EnumValue;
    fuelItems?: Array<FuelItemResponse> | null;
    fuelStopFranchise?: FuelStopFranchiseMinimalResponse;
    store?: string | null;
    fax?: string | null;
    pricePerGallon?: number | null;
    lowestPricePerGallon?: number | null;
    highestPricePerGallon?: number | null;
    favourite?: boolean;
    lastUsed?: string | null;
    totalCost?: number | null;
    isClosed?: boolean;
    fuelTransactions?: Array<FuelTransactionResponse> | null;
    type?: EnumValue;
    loadNumber?: string | null;
    statusType?: EnumValue;
    lastStatusPassed?: { [key: string]: number } | null;
    company?: CompanyShortResponse;
    dateCreated?: string | null;
    dispatch?: DispatchShortResponse;
    broker?: BrokerShortResponse;
    brokerContact?: BrokerContactResponse;
    referenceNumber?: string | null;
    generalCommodity?: EnumValue;
    weight?: number | null;
    loadRequirements?: LoadRequirementsResponse;
    stops?: Array<LoadStopResponse> | null;
    splitLoad?: SplitLoadResponse;
    baseRate?: number;
    adjustedRate?: number | null;
    revisedRate?: number | null;
    tonuRate?: number | null;
    driverRate?: number | null;
    additionalBillingRatesTotal?: number | null;
    additionalBillingRates?: Array<LoadBillingAdditionalResponse> | null;
    totalRate?: number;
    totalAdjustedRate?: number | null;
    advancePay?: number | null;
    pays?: Array<LoadPaymentPayResponse> | null;
    statusHistory?: Array<LoadStatusHistoryResponse> | null;
    commentsCount?: number;
    comments?: Array<CommentResponse> | null;
    totalPaid?: number | null;
    totalDue?: number;
    loadedMiles?: number;
    totalMiles?: number;
    totalTimeDays?: number;
    totalTimeHours?: number;
    paidDate?: string | null;
    invoicedDate?: string | null;
    shortPaid?: number | null;
    age?: number | null;
    totalLoadTime?: { [key: string]: number } | null;
    firstPickupTime?: { [key: string]: number } | null;
    lastDeliveryTime?: { [key: string]: number } | null;
    currentLocation?: AddressEntity;
    nextStop?: LoadStopResponse;
    completedPercentage?: number;
    pendingPercentage?: number | null;
    closedPercentage?: number | null;
    progressBar?: Array<LoadStopProgressBarResponse> | null;
}

export interface tableBodyOptionsConfig {
    showSort?: boolean;
    sortBy?: string;
    sortDirection?: string;
    minWidth?: number;
    disabledColumns?: number[];
}

export interface tableBodyColumnsLink {
    doesNotHaveRout?: boolean;
    routerLinkStart?: string;
    routerLinkEnd?: string;
}

export interface viewModelOption {
    name?: string;
    active?: boolean;
}

export interface tableBodyColumnsProgress {
    start?: string;
    end?: string;
}

export interface tableBodyColumnsImageHover {
    url?: string;
    file?: string;
}

export interface tableBodyColumnsColorTemplate {
    value?: string;
}

export interface tableBodyColumnsAvatar {
    src?: string;
}

export interface tableBodyColumnsheadIconStyle {
    width?: number;
    height?: number;
    imgPath?: string;
}

export interface tableBodyColumnsSvgDimensions {
    width?: number;
    height?: number;
}

export interface tableBodyColorLabel {
    code?: string;
    color?: string;
    createdAt?: string;
    hoverCode?: string;
    name?: string;
    updatedAt?: string;
    colorId?: number;
    count?: number;
    id?: number;
}
