import {HistoryData} from 'src/app/shared/truckassist-history-data/truckassist-history-data.component';
import {Address} from './address';
import {IApplicant} from './applicant';
import {MetaData} from './shared/enums';
import {OwnerData} from './shared/owner';

export interface DriverTabData {
  applicantDrivers: IApplicant[];
  activeDrivers: DriverData[];
  allDrivers: DriverData[];
  inactiveDrivers: DriverData[];
}

export interface DriverData {
  guid?: string;
  id?: number;
  companyId?: number;
  ssn: number | string;
  linkCompany?: number;
  fuelCards?: FuelCard[];
  status?: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  bankId: number;
  accountNumber?: string;
  routingNumber?: string;
  locked?: number | boolean;
  twic?: number | boolean;
  isOwner?: number | boolean;
  expirationDate?: Date | string;
  dateOfBirth?: Date | string;
  taxNumber?: string;
  businessName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  paymentType?: string;
  emptyMiles?: string | number;
  loadedMiles?: string | number;
  commission?: string | number;
  commissionOwner?: string | number;
  doc?: DriverDoc;
  additionalData?: AdditionalData;
  licenseData?: LicenseData[];
  testData?: TestData[];
  medicalData?: MedicalData[];
  mvrData?: MvrData[];
  workData?: HistoryData[];
  error?: any;
  phone?: string;
  animationType?: string;
  isSelected?: boolean;
  Owner?: any;
  owner?: any;
  DriverUser?: any;
  driverUser?: any;
  driverUserId?: any;
  avatar?: string;
  cdl?: number;
}

export interface DriverDoc {
  additionalData: AdditionalData;
  licenseData?: LicenseData[];
  testData?: TestData[];
  medicalData?: MedicalData[];
  mvrData?: MvrData[];
  workData?: HistoryData[];
}

export interface LicenseData {
  id: number;
  country: any;
  class: any;
  startDate: Date;
  endDate: Date;
  state: any;
  note: string;
  number: number;
  attachments: any[];
  restrictions: RestrictionData[];
  endorsements: EndorsementData[];
}

export interface UpsertedLicenseData {
  driverId: number;
  licenseData: LicenseData;
}

export interface EndorsementData {
  id: number;
  domain?: string;
  endorsementCode: string;
  endorsementName: string;
}

export interface RestrictionData {
  id: number;
  domain?: string;
  restrictionCode: string;
  restrictionName: string;
}

export interface AdditionalData {
  avatar?: Avatar;
  phone?: string;
  email?: string;
  address?: Address;
  addressUnit?: string;
  type?: string;
  note?: string;
  files?: any[];
  birthDateShort?: Date | string;
  paymentType?: any;
  emptyMiles?: string | number;
  loadedMiles?: string | number;
  notifications?: Array<[]>;
  workStartDate?: Date;
  driverImage?: string;
  bankData?: BankData;
  businessData?: BusinessData;
}

export interface Avatar {
  id: number;
  src: string;
}

export interface BankData {
  id?: number;
  bankLogo?: string;
  bankLogoWide?: string;
  companyId?: number;
  bankName?: string;
  accountNumber?: number;
  routingNumber?: number;
}

export interface BusinessData {
  isOwner?: boolean | number;
  isBusinessOwner?: number | boolean;
  taxId?: string;
  businessName?: string;
}

export interface TestData {
  id: number;
  type: MetaData;
  reason: MetaData;
  testingDate: Date;
  note: string;
  attachments?: any;
}

export interface MedicalData {
  id: number;
  startDate: Date;
  endDate: Date;
  attachments: any;
}

export interface MvrData {
  id: number;
  startDate: Date;
  attachments: any;
}

export interface DriverOwnerData {
  driver: DriverData;
  owner: OwnerData;
}

export interface FuelCard {
  fuelCardNumber: string;
  cardBrand: string;
}
