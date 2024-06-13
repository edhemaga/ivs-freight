import { RepairShopServiceTypeCommand, RepairShopContactCommand, AddressEntity } from "appcoretruckassist";

export interface CreateShopModel {
    name: string;
    phone: string;
    phoneExt: string;
    email: string;
    pinned: boolean;
    note: string;
    // companyOwned: boolean;
    bankId: number;
    account: string;
    routing: string;
    // rent: number;
    // payPeriod: PayPeriod;
    // weeklyDay: DayOfWeek;
    // monthlyDay: number;
    longitude: number;
    latitude: number;
    openHoursSameAllDays: boolean;
    openAlways: boolean;
    startTimeAllDays: string;
    endTimeAllDays: string;
    serviceTypes: Array<RepairShopServiceTypeCommand>;
    // openHours: Array<RepairShopOpenHoursCommand>;
    contacts: Array<RepairShopContactCommand>;
    files: Array<Blob>;
    shopServiceType: number;
    address: AddressEntity;
    filesForDeleteIds: string[]
}