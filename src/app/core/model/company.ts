import { Address } from './address';

export interface ManageCompany {
   id: number;
   name: string;
   parentId: number;
   category: string;
   startLoadNumber: number;
   isOwner: number;
   locked: number;
   taxNumber: number | string;
   companyDivision: any;
   doc: ManageCompanyDoc;
}

export interface ManageCompanyDoc {
   additional?: AdditionalData;
   offices?: CompanyOffice[];
   factoringCompany?: FactoringCompany[];
   insurancePolicy?: any;
   taxNumber: number | string;
}

export interface Avatar {
   id: number;
   src: string;
}

export interface AdditionalData {
   avatar?: Avatar;
   mcNumber?: number;
   usDotNumber?: number;
   accountNumber?: number;
   routingNumber?: number;
   phone?: number;
   payPeriod?: any;
   endingIn?: string;
   email?: string;
   address?: Address;
   addressUnit?: string | number;
   irpNumber?: number | string;
   scacNumber?: number | string;
   ipassEzpass?: number | string;
   iftaNumber?: number | string;
   fax?: number;
   timeZone?: TimeZoneData;
   webUrl?: string;
   currency?: any;
   note?: string;
   bankData?: BankData;
   phoneDispatch?: number;
   emailDispatch?: string;
   phoneAccounting?: number;
   emailAccounting?: string;
   phoneSafety?: number;
   emailSafety?: string;
}

export interface TimeZoneData {
   id?: number;
   name?: string;
}

export interface CompanyOffice {
   id?: number;
   phone?: number;
   email?: string;
   address?: Address;
   addressUnit?: string | number;
   address_unit?: string | number;
   note?: string;
}

export interface FactoringCompany {
   id?: number;
   name?: string;
   phone?: number;
   email?: string;
   address?: Address;
   addressUnit?: string | number;
   address_unit?: string | number;
   note?: string;
   notice?: string;
}

export interface BankData {
   id?: number;
   bankLogo?: string;
   bankLogoWide?: string;
   bankName?: string;
}
