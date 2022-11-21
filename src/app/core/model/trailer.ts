// import { Color } from './shared/color';

import { HistoryData } from '../components/shared/history-data/history-data.component';

export interface TrailerTabData {
  activeTrailers: TrailerData[];
  allTrailers: TrailerData[];
  inactiveTrailers: TrailerData[];
}

export interface TrailerData {
  guid?: string;
  id?: number;
  companyId?: number;
  companyOwned: number;
  ownerId?: number;
  trailerNumber: number;
  divisionFlag: number;
  vin: string;
  status: number;
  categoryId: number;
  doc?: TrailerDoc;
  meta?: any;
  year?: string;
  animationType?: string;
  isSelected?: boolean;
  ownerName?: string;
  length?: string;
}

export interface TrailerDoc {
  additionalData: TrailerAdditional;
  licenseData?: TrailerLicense[];
  inspectionData?: TrailerInspection[];
  titleData?: TrailerTitle[];
  trailerLeaseData?: TrailerLease[];
  activityHistory?: HistoryData[];
}

export interface TrailerAdditional {
  axises?: string;
  color?: ColorData;
  emptyWeight?: string;
  engine?: any;
  insurancePolicyNumber?: string;
  make?: MakeData;
  mileage?: string;
  model?: string;
  note?: string;
  tireSize?: number;
  length?: LengthData;
  type?: TypeData;
  year?: string;
  reeferUnit?: ReeferUnitData;
}

export interface LengthData {
  id: number;
  key: string;
  value: string;
  domain: string;
  entityId: any;
  parentId: any;
  companyId: any;
  createdAt: string;
  protected: number;
  updatedAt: string;
  entityName: any;
}

export interface MakeData {
  file: string;
  name: string;
  color: string;
}

export interface TypeData {
  file: string;
  name: string;
  type: string;
  color: string;
  whiteFile: string;
  class?: string;
}

export interface ReeferUnitData {
  id: number;
  name: string;
}

export interface ColorData {
  id: number;
  key: string;
  value: string;
  domain: string;
}

export interface TrailerLicense {
  id?: string;
  startDate?: string;
  endDate?: string;
  licensePlate?: string;
  attachments?: any;
}

export interface TrailerInspection {
  id?: string;
  startDate?: string;
  endDate?: string;
  attachments?: any;
}

export interface TrailerTitle {
  id?: string;
  titleNumber?: string;
  startDate?: string;
  attachments?: any;
}

export interface TrailerLease {
  id?: string;
  lessor?: any;
  seller?: any;
  date?: any;
  paymentAmount?: any;
  numberOfPayments?: any;
  downPayment?: any;
  attachments?: any;
}

export interface TrailerOwner {
  id: number;
  ownerName: string;
  ownerType: string;
  divisionFlag: number;
}
