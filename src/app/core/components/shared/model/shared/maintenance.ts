import {ServerResponse, ServerResponseList} from './response';
import {Items} from '../truck';
import {RepairShop} from './repairShop';

export interface Maintenance {
  id: number;
  date: Date;
  invoice: string;
  items: [Items];
  laborPrice: number;
  millage: string;
  price: number | string;
  repairShop: RepairShop;
  total: number;
  property: Property;
}

export interface MaintenanceList extends ServerResponseList {
  data: Maintenance[];
}

export interface MaintenanceDetail extends ServerResponse {
  data: Maintenance;
}

export interface Property {
  id: number;
  number: string;
}

// V2 //////////////////////////////////////////////////////////////////////////
export interface TruckTrailerMaintenance {
  countTrailer: number;
  countTruck: number;
  maintenanceTrailerList: ManageMaintenance[];
  maintenanceTruckList: ManageMaintenance[];
}

export interface ManageMaintenance {
  id?: string;
  repairShopId: number;
  truckId: number;
  trailerId: number;
  category: string;
  maintenanceDate: string | Date;
  invoiceNo: number | string;
  createdAt?: string;
  mileage?: any;
  description?: string;
  doc: MaintanenceDoc;
}

export interface MaintanaceData {
  countTrailer: number;
  countTruck: number;
  maintenanceTrailerList: ManageMaintenance[];
  maintenanceTruckList: ManageMaintenance[];
}

export interface MaintanenceDoc {
  millage?: number | string;
  total?: number | string;
  types?: MaintanenceTypes[];
  items?: MaintenenceItems[];
  repairShop?: RepairShopDetails;
  unit?: number | string;
  additionalData?: MaintanenceAdditionalData;
  attachments: any[];
}

export interface MaintanenceAdditionalData {
  note: string;
}

export interface MaintanenceTypes {
  id?: string | number;
  name?: string;
  checked?: boolean;
}

export interface MaintenenceItems {
  id?: number;
  item?: string;
  price?: number | string;
  quantity?: number;
  subtotal?: number;
}

export interface RepairShopDetails {
  id: number;
  name: string;
  contact: RepairShopContact;
}

export interface RepairShopContact {
  email: string;
  phone: number;
  address: string;
}

////////////////////////////////////////////////////////////////////////////////
