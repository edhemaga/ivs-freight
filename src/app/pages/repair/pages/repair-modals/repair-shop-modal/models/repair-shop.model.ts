import {
    RepairShopServiceTypeCommand,
    RepairShopContactCommand,
    AddressEntity,
    RepairShopOpenHoursCommand,
} from 'appcoretruckassist';

export interface CreateShopModel {
    id?: number;
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
    filesForDeleteIds: string[];
    cover?: Blob;
    status?: number;
    isCompanyRelated: boolean;
}
