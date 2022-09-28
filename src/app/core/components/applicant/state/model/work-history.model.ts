export interface WorkHistoryModel {
  id?: number;
  applicantId?: string;
  employer: string;
  jobDescription: string;
  fromDate: string;
  toDate: string;
  employerPhone: string;
  employerEmail: string;
  employerFax: string;
  employerAddress: any;
  employerAddressUnit: string;
  isDrivingPosition: boolean;
  classesOfEquipment: AnotherClassOfEquipmentModel[];
  truckType?: string;
  trailerType?: string;
  trailerLength?: string;
  cfrPart?: boolean;
  fmCSA?: boolean;
  reasonForLeaving: string;
  accountForPeriod: string;
  isEditingWorkHistory: boolean;
}

export interface AnotherClassOfEquipmentModel {
  vehicleType: string;
  vehicleTypeImageLocation: string;
  trailerType: string;
  trailerTypeImageLocation: string;
  trailerLength: string;
  isEditingClassOfEquipment: boolean;
}

export class WorkHistory {
  id?: number;
  applicantId?: string;
  employer: string;
  jobDescription: string;
  fromDate?: string;
  toDate?: string;
  employerPhone: string;
  employerEmail: string;
  employerAddress: string;
  employerAddressUnit: string;
  isDrivingPosition: boolean;
  truckType?: string;
  trailerType?: string;
  trailerLength: string;
  cfrPart?: boolean;
  fmCSA?: boolean;
  reasonForLeaving: string;
  accountForPeriod: string;
  isDeleted: boolean;
  isCompleted: boolean;
  isExpanded: boolean;

  constructor(workHistory?: WorkHistory) {
    this.id = workHistory?.id ? workHistory.id : 0;
    this.applicantId = workHistory?.applicantId
      ? workHistory.applicantId
      : null;

    this.truckType = workHistory?.truckType;
    this.trailerType = workHistory?.trailerType;
    this.fromDate = workHistory?.fromDate ? workHistory?.fromDate : undefined;
    this.toDate = workHistory?.toDate ? workHistory?.toDate : undefined;
    this.employerPhone = workHistory?.employerPhone
      ? workHistory?.employerPhone
      : '';
    this.employerEmail = workHistory?.employerEmail
      ? workHistory?.employerEmail
      : '';
    this.employerAddress = workHistory?.employerAddress
      ? workHistory?.employerAddress
      : '';
    this.employerAddressUnit = workHistory?.employerAddressUnit
      ? workHistory?.employerAddressUnit
      : '';
    this.isDrivingPosition = workHistory?.isDrivingPosition
      ? workHistory?.isDrivingPosition
      : false;
    this.trailerLength = workHistory?.trailerLength
      ? workHistory?.trailerLength
      : '';
    this.cfrPart = workHistory?.cfrPart;
    this.fmCSA = workHistory?.fmCSA;
    this.reasonForLeaving = workHistory?.reasonForLeaving
      ? workHistory?.reasonForLeaving
      : '';
    this.accountForPeriod = workHistory?.accountForPeriod
      ? workHistory?.accountForPeriod
      : '';
    this.id = workHistory?.id ? workHistory?.id : undefined;
    this.employer = workHistory?.employer ? workHistory?.employer : '';
    this.jobDescription = workHistory?.jobDescription
      ? workHistory?.jobDescription
      : '';
    this.isDeleted = workHistory?.isDeleted ? workHistory?.isDeleted : false;
    this.isCompleted = workHistory?.isCompleted
      ? workHistory?.isCompleted
      : false;
    this.isExpanded = workHistory?.isExpanded ? workHistory?.isExpanded : false;
  }
}
