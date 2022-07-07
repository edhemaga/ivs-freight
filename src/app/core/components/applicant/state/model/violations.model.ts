export interface ViolationModel {
  violationDate: string;
  truckType: string;
  violationLocation: string;
  violationDescription: string;
}

export class ViolationInfo {
  id?: number;
  applicantId?: string;
  noViolationsForPastTwelveMonths: boolean;
  notBeenConvicted: boolean;
  onlyOneHoldLicense: boolean;
  certify: boolean;
  violations: Violation[];
  isCompleted: boolean;

  constructor(violationInfo?: ViolationInfo) {
    this.id = violationInfo?.id ? violationInfo?.id : undefined;
    this.applicantId = violationInfo?.applicantId
      ? violationInfo?.applicantId
      : undefined;
    this.noViolationsForPastTwelveMonths =
      violationInfo?.noViolationsForPastTwelveMonths
        ? violationInfo?.noViolationsForPastTwelveMonths
        : false;
    this.notBeenConvicted = violationInfo?.notBeenConvicted
      ? violationInfo?.notBeenConvicted
      : false;
    this.onlyOneHoldLicense = violationInfo?.onlyOneHoldLicense
      ? violationInfo?.onlyOneHoldLicense
      : false;
    this.certify = violationInfo?.certify ? violationInfo?.certify : false;
    this.violations = violationInfo?.violations
      ? violationInfo?.violations
      : [];
    this.isCompleted = violationInfo?.isCompleted
      ? violationInfo?.isCompleted
      : true;
  }
}

export class Violation {
  id?: number;
  violationDate?: string;
  truckType: string;
  violationLocation: string;
  violationDescription: string;
  isDeleted: boolean;

  constructor(violation?: Violation) {
    this.id = violation?.id ? violation?.id : undefined;
    this.violationDate = violation?.violationDate
      ? violation?.violationDate
      : undefined;
    this.truckType = violation?.truckType ? violation?.truckType : '';
    this.violationLocation = violation?.violationLocation
      ? violation?.violationLocation
      : '';
    this.violationDescription = violation?.violationDescription
      ? violation?.violationDescription
      : '';
    this.isDeleted = violation?.isDeleted ? violation?.isDeleted : false;
  }
}
