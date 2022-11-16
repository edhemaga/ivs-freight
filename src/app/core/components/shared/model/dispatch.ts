import { ServerResponseList } from './shared/response';
import { Enums } from './shared/enums';

export class DispatchLoad {
  id: number;
  loadNumber: number;
  customer: string;
  pickup: string;
  destination: string;
  total: number;
  status?: string;
  pickupAddress: string;
  destinationAddress: string;
}

export class Dispatch {
  id: number;
  loadId: number;
  total: number;
  truck: Enums;
  status: Enums;
  trailer: Enums;
  driver: DriverDispatch;
  dispatcher: Enums;
  pickups: ShipperDispatch[];
  destinations: ShipperDispatch[];
  note: string;
  customer: string;
  sort: number;
  color: string;
  phone?: string;
  email?: string;
}

export class DriverDispatch {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export class ShipperDispatch {
  city: string;
  date: Date;
  state: string;
  zip: string;
}

export interface DispatchLoadList extends ServerResponseList {
  data: DispatchLoad[];
}

export interface DispatchList extends ServerResponseList {
  data: Dispatch[];
}
