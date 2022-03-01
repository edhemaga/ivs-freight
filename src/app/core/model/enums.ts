import {ServerResponse, ServerResponseList} from './response';

export interface Enums {
  id: any;
  name: string;
  image: string;
  text?: string;
  email?: string;
  phone?: string;
}

export interface EnumsList extends ServerResponseList {
  data: Enums[];
}

export interface EnumsDetail extends ServerResponse {
  data: Enums;
}

export interface Vehicles {
  TRAILER: string;
  TRUCK: string;
}

export interface VehiclesList extends ServerResponse {
  data: Vehicles;
}

export interface UnitNumber {
  id: number;
  property: string;
}

export interface UnitNumberList extends ServerResponse {
  data: UnitNumber[];
}

export interface TruckLoadList {
  truckId: number;
  truckName: string;
  trailerId: number;
  trailerName: string;
  driverId: number;
  driverName: string;
}

export interface TruckResponseLoadList extends ServerResponse {
  data: TruckLoadList[];
}

// V2

export interface DeletedItem {
  id: number;
}

export interface ActiveItem {
  id: number;
}

export interface UpdatedItem {
  id: number;
}

export interface MetaData {
  id?: number;
  companyId?: number;
  domain: string;
  key: any;
  value: any;
}

export interface UpdatedData {
  failure: any[];
  notExist: any[];
  success: any[];
}
