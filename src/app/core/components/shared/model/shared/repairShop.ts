import { ServerResponse, ServerResponseList } from './response';
import { ZipCode } from './zipCode';
import { Address } from '../address';

export interface RepairShop {
  id: number;
  name: string;
  email: string;
  phone: string;
  contact?: any;
  street: string;
  address_unit: string;
  zip: ZipCode;
  hasMaintenances: boolean;
  types: any;
  likes: string;
  dislikes: string;
  pinned: string;
  latitude: number;
  longitude: number;
}

export interface RepairShopList extends ServerResponseList {
  data: RepairShop[];
}

export interface RepairShopDetail extends ServerResponse {
  data: RepairShop;
}

// v2 //////////////////////////////////////////////////////////////////////////
export interface RepairShops {
  count: number;
  data: ManageRepairShop[];
}

export interface ManageRepairShop {
  id?: number;
  companyID: number;
  name: string;
  status: number;
  pinned: number;
  latitude: number;
  longitude: number;
  upCount: number;
  downCount: number;
  thumbUp: number;
  thumbDown: number;
  latestComment: string;
  repairCount: number;
  total: string | number;
  doc: RepairShopDoc;
  textPhone?: string | number;
  textEmail?: string | number;
  textAddress?: string | number;
}

export interface RepairShopDoc {
  phone: number | string;
  email: string;
  address: Address;
  addressUnit: string;
  string?: any;
  types: RepairShopTypes[];
}

export interface RepairShopTypes {
  id: number;
  name: string;
  checked: number;
}

////////////////////////////////////////////////////////////////////////////////
/* Rating */
export interface RepairShopRatingList {
  id: number;
  userId: number;
  repairShopId: number;
  thumbUp: number;
  thumbDown: number;
  givenRating: number;
  calculatedRating: number;
  note: string;
  createdAt: string;
  updatedAt: string;
}
