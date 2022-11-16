export interface SphFormAccidentModel {
  accidentDate: string;
  accidentLocation: any;
  accidentState?: string;
  accidentDescription: string;
  hazmatSpill: string;
  fatalities: number;
  injuries: number;
  isEditingAccident: boolean;
}

export interface AccidentModel {
  id?: number;
  location: any;
  date: string;
  accidentState?: string;
  fatalities: number;
  injuries: number;
  hazmatSpill?: boolean;
  vehicleType: string;
  description: string;
  isEditingAccident: boolean;
  accidentRecordReview: any;
}

export class Accident {
  id?: number;
  accidentLocation?: Location;
  accidentDate?: string;
  fatalities: number;
  injuries: number;
  hazmatSpill?: string;
  truckType: string;
  accidentDescription: string;
  isDeleted: boolean;
  isCompleted: boolean;
  accident: globalThis.Location;

  constructor(accident?: Accident) {
    this.id = accident?.id ?? undefined;
    this.accidentLocation = accident?.accidentLocation ?? undefined;
    this.accidentDate = accident?.accidentDate ?? undefined;
    this.fatalities = accident?.fatalities ?? 0;
    this.injuries = accident?.injuries ?? 0;
    this.accidentDescription = accident?.accidentDescription ?? '';
    this.truckType = accident?.truckType ?? '';
    this.hazmatSpill = accident?.hazmatSpill ?? '';
    this.isCompleted = accident?.isCompleted ?? false;
    this.isDeleted = accident?.isDeleted ?? false;
  }
}

export class AccidentInfo {
  id?: number;
  applicantId?: string;
  accidents?: Accident[];
  hasPastAccident: boolean;
  isDeleted: boolean;
  isCompleted: boolean;

  constructor(accidentInfo?: AccidentInfo) {
    this.id = accidentInfo?.id ?? undefined;
    this.applicantId = accidentInfo?.applicantId
      ? accidentInfo.applicantId
      : undefined;
    this.accidents = accidentInfo?.accidents ? accidentInfo.accidents : [];
    this.hasPastAccident = accidentInfo?.hasPastAccident
      ? accidentInfo.hasPastAccident
      : false;
    this.isCompleted = accidentInfo?.isCompleted ?? false;
    this.isDeleted = accidentInfo?.isDeleted ?? false;
  }
}

export class Location {
  id?: number;
  address: string;
  city: string;
  country: string;
  state: string;
  stateShortName: string;
  streetName: string;
  streetNumber: string;
  zipCode: string;
  isCompleted: boolean;
  isDeleted: boolean;

  constructor(location?: Location) {
    this.id = location?.id ?? undefined;
    this.address = location?.address ?? '';
    this.city = location?.city ?? '';
    this.country = location?.country ?? '';
    this.state = location?.state ?? '';
    this.stateShortName = location?.stateShortName ?? '';
    this.streetName = location?.streetName ?? '';
    this.streetNumber = location?.streetNumber ?? '';
    this.zipCode = location?.zipCode ?? '';
    this.isCompleted = location?.isCompleted ?? false;
    this.isDeleted = location?.isDeleted ?? false;
  }
}
