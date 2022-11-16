import { Enums } from './enums';
import { ServerResponse, ServerResponseList } from './response';

export interface LoadColumn {
  name: string;
  title: string;
  resizable: boolean;
  hidden: boolean;
  disabled: boolean;
  field: string;
  width: any;
  minWidth: any;
  orderIndex: number;
  sortable: boolean;
  alignCenter: boolean;
  number: boolean;
  disableExport: boolean;
  filterable: boolean;
}

export class LoadDataResult {
  pendingLoads: Load[];
  activeLoads: Load[];
  closedLoads: Load[];
}

export class LoadResponse {
  count: any[];
  loads: Load[];
}

export class Load {
  id: number;
  loadNumber: number;
  customerLoadNumber: string;
  customer: string;
  pickups: Pickup[];
  destinations: Destination[];
  total: number;
  status: string;
  note: string;
  truck: { name: string };
  dispatcher: Enums;
  checked: boolean;
  mileage: Load;
}

export class LoadDetail {
  loadNumber: number;
  customerLoadNumber: string;
  companyCheck: boolean;
  division: Enums;
  status: Enums;
  type: string;
  customer: Enums;
  pickup: PickupDetail;
  dispatchItem: any;
  destination: DestinationDetail;
  note: string;
  baseRate: number;
  reviseRate: number;
  deductions: EnumsTypeValue[];
  additions: EnumsTypeValue[];
  dispatcher: Enums;
  mileage: string;
  waypointRoutes: WaypointRoutes[];
}

export class EnumsTypeValue {
  id: number;
  type: string;
  value: number;
}

export class Pickup {
  city: string;
  date: Date;
  state: string;
}

export class PickupDetail {
  id: number;
  shipper: number;
  pickupDateTime: Date;
  pickupAddress: string;
  // pickupRoutes: PickupRoutes[];
}

export class DestinationDetail {
  id: number;
  shipper: number;
  destinationDateTime: Date;
  destinationAddress: string;
  // destiantionRoutes: PickupRoutes[];
}

export class WaypointRoutes {
  id: number;
  shipper: number;
  type: string;
  dateTime: Date;
}

export class Destination {
  city: Enums;
  date: Date;
  state: string;
}

export interface LoadList extends ServerResponseList {
  data: Load[];
}

export interface LoadDetailEdit extends ServerResponse {
  data: LoadDetail;
}

/* NEW */
export class LoadTypes {
  allLoads: LoadTabledata[];
  activeLoads: LoadTabledata[];
  closedLoads: LoadTabledata[];
  pendingLoads: LoadTabledata[];
  activeCount: 1;
  allCount: 9;
  closedCount: 0;
  pendingCount: 7;
}

export class LoadTabledata {
  id: number;
  eventId: number;
  category: string;
  dispatchBoardId: number;
  truckId: number;
  truckNumber: number;
  trailerId: number;
  trailerNumber: number;
  driverId: number;
  driverName: string;
  driverPhone: string;
  driverEmail: string;
  driverAddress: string;
  customerId: number;
  customerName: string;
  loadNumber: number;
  statusId: number;
  status: string;
  subStatusId: number;
  subStatusCounter: number;
  note: string;
  baseRate: number;
  customerLoadNumber: string;
  additionTotal: number;
  deductionTotal: number;
  total: number | string;
  companyCheck: number;
  reviseRate: number;
  dispatcherId: number;
  dispatcherName: string;
  pickupId: number;
  pickupName: string;
  pickupLocation: string;
  pickupDateTime: string;
  deliveryId: number;
  deliveryName: string;
  deliveryLocation: string;
  deliveryDateTime: string;
  mileage: string;
  pickupCount: number;
  deliveryCount: number;
  locked: number;
  createdAt: string;
  updatedAt: string;
  doc: {
    additions: [];
    waypoints: [];
  };
  adjusted?: any;
  advance?: any;
  additional?: any;
  assignedCompanyId?: number;
  route?: any;
}
