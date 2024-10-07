import { RepairShopServiceTypeCommand, RepairShopContactCommand, AddressEntity, PayPeriod, DayOfWeek, RepairShopOpenHoursCommand } from "appcoretruckassist";

export interface CreateShopModel {
    name: string;
    phone: string;
    phoneExt: string;
    email: string;
    pinned: boolean;
    note: string;
    companyOwned: boolean;
    bankId: number;
    account: string;
    routing: string;
    rent: number;
    payPeriod: number;
    weeklyDay: number;
    monthlyDay: number;
    longitude: number;
    latitude: number;
    // openAlways: boolean;
    openHours: Array<RepairShopOpenHoursCommand>;
    serviceTypes: Array<RepairShopServiceTypeCommand>;
    contacts: Array<RepairShopContactCommand>;
    files: Array<Blob>;
    shopServiceType: number;
    address: AddressEntity;
    filesForDeleteIds: string[]
}