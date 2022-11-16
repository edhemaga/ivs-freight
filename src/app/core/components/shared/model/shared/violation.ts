export interface Violation {
   id?: number;
   companyId?: number;
   report?: string;
   driverId?: number;
   driverFullName?: string;
   avatar?: string;
   truckId?: number;
   truckNumber?: string;
   trailerId?: number;
   trailerNumber?: string;
   eventDateTime?: string;
   eventDate?: string;
   eventTime?: string;
   typeDescription?: any;
   oos?: string;
   lvl?: string;
   categories?: Category[];
   citations?: any[];
   citation?: number;
   citationTotal?: any;
   violationsTotal?: ViolationsTotal[];
   policeDept?: string;
   policeAddress?: string;
   policePhone?: any;
   policeFax?: any;
   highway?: string;
   location?: string;
   county?: any;
   state?: string;
   country?: string;
   longitude?: number;
   latitude?: number;
   milepost?: any;
   shipperId?: number;
   shipperName?: string;
   pickupId?: any;
   origin?: string;
   originLongitude?: number;
   originLatitude?: number;
   deliveryId?: any;
   destination?: string;
   destinationLongitude?: number;
   destinationLatitude?: number;
   cargo?: string;
   hazmat?: number;
   bol?: string;
   note?: string;
   doc?: Doc;
   active?: number;
   createdAt?: string;
   updatedAt?: string;
   guid?: string;
}

interface Doc {
   address?: Address;
   attachments?: Attachment[];
   specialChecks?: SpecialCheck[];
}

interface SpecialCheck {
   id?: number;
   name?: string;
   checked?: boolean;
}

interface Attachment {
   url?: string;
   fileName?: string;
   fileItemGuid?: string;
}

interface Address {
   city?: string;
   state?: string;
   address?: string;
   country?: string;
   zipCode?: string;
   streetName?: string;
   streetNumber?: string;
   stateShortName?: string;
}

interface ViolationsTotal {
   violationType?: number;
   total?: number;
}

interface Category {
   id?: any;
   typeId?: number;
   violationId?: number;
   code?: string;
   description?: string;
   driverFlag?: number;
   truckFlag?: number;
   trailerFlag?: number;
   sw?: number;
   swPlus?: number;
   tiw?: number;
   totw?: number;
}

export interface ViolationManage {
   reportNumber?: string;
   driverName?: string;
   date?: string;
   time?: string;
   state?: string;
   truck?: string;
   trailer?: string;
   lvl?: string;
   lvlTitle?: string;
   violationsData?: ViolationManageListData[];
   oos?: ViolationManageListDataOOS[];
   customer?: string;
   citation?: ViolationManageListDataCitation[];
   citationNumber?: string;
   policeDepartment?: ViolationManagePolice;
   files?: ViolationManageListDataFiles[];
   total?: string;
}

export interface ViolationManageListDataFiles {
   title?: string;
   fileUrl?: string;
}

export interface ViolationManageListDataCitation {
   title?: string;
   desc?: string;
   value?: string;
}

export interface ViolationManageListDataOOS {
   active?: boolean;
   title?: string;
   value?: string;
}

export interface ViolationManageListData {
   title?: string;
   iconUrl?: string;
   sumWeight?: string;
   timeWeight?: string;
   weight?: string;
   violationDetails?: ViolationManageListDataDetails[];
}

export interface ViolationManageListDataDetails {
   title?: string;
   oos?: string;
   oosStatus?: boolean;
   weight?: string;
   desc?: string;
}

export interface ViolationManagePolice {
   policeDepartment?: string;
   address?: string;
   phone?: string;
   fax?: string;
}
