export class Applicant {
  id?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth?: string;
  code: string;
  phone: string;
  email: string;
  address: string;
  addressUnit: string;
  note: string;
  createdBy: string;
  createdDate?: Date;

  constructor(applicant?: Applicant) {
    this.id = applicant?.id ?? undefined;
    this.firstName = applicant?.firstName ?? '';
    this.lastName = applicant?.lastName ?? '';
    this.fullName = applicant?.fullName ?? '';
    this.dateOfBirth = this.dateOfBirth ?? undefined;
    this.phone = applicant?.phone ?? '';
    this.email = applicant?.email ?? '';
    this.address = applicant?.address ?? '';
    this.addressUnit = applicant?.addressUnit ?? '';
    this.code = applicant?.code ?? '';
    this.note = applicant?.note ?? '';
    this.createdBy = applicant?.createdBy ?? '';
    this.createdDate = applicant?.createdDate ?? undefined;
  }
}

export class PersonalInfo {
  id?: number;
  ssn: string;
  legalWork: boolean;
  legalWorkExplain: string;
  isAgreement: boolean;
  anotherName: boolean;
  anotherNameExplain: string;
  inMilitary: boolean;
  inMilitaryExplain: string;
  felony: boolean;
  felonyExplain: string;
  misdemeanor: boolean;
  misdemeanorExplain: string;
  drunkDriving: boolean;
  drunkDrivingExplain: string;
  bank?: Bank;
  previousAddresses?: IApplicantAddress[];
  applicantId?: string;
  isCompleted: boolean;

  constructor(personalInfo?: PersonalInfo) {
    this.id = personalInfo?.id ? personalInfo?.id : undefined;
    this.ssn = personalInfo?.ssn ? personalInfo?.ssn : '';
    this.legalWork = personalInfo?.legalWork ? personalInfo?.legalWork : false;
    this.legalWorkExplain = personalInfo?.legalWorkExplain
      ? personalInfo?.legalWorkExplain
      : '';
    this.isAgreement = personalInfo?.isAgreement
      ? personalInfo?.isAgreement
      : false;
    this.anotherName = personalInfo?.anotherName
      ? personalInfo?.anotherName
      : false;
    this.anotherNameExplain = personalInfo?.anotherNameExplain
      ? personalInfo?.anotherNameExplain
      : '';
    this.inMilitary = personalInfo?.inMilitary
      ? personalInfo?.inMilitary
      : false;
    this.inMilitaryExplain = personalInfo?.inMilitaryExplain
      ? personalInfo?.inMilitaryExplain
      : '';
    this.felony = personalInfo?.felony ? personalInfo?.felony : false;
    this.felonyExplain = personalInfo?.felonyExplain
      ? personalInfo?.felonyExplain
      : '';
    this.misdemeanor = personalInfo?.misdemeanor
      ? personalInfo?.misdemeanor
      : false;
    this.misdemeanorExplain = personalInfo?.misdemeanorExplain
      ? personalInfo?.misdemeanorExplain
      : '';
    this.drunkDriving = personalInfo?.drunkDriving
      ? personalInfo?.drunkDriving
      : false;
    this.drunkDrivingExplain = personalInfo?.drunkDrivingExplain
      ? personalInfo?.drunkDrivingExplain
      : '';
    this.bank = personalInfo?.bank ? personalInfo?.bank : undefined;
    this.previousAddresses = personalInfo?.previousAddresses
      ? personalInfo?.previousAddresses
      : [];
    this.isCompleted = personalInfo?.isCompleted
      ? personalInfo?.isCompleted
      : false;
  }
}

export class Bank {
  id?: string;
  name?: string;
  accountNumber: string;
  routingNumber: string;
  isCompleted: boolean;

  constructor(bank?: Bank) {
    this.id = bank?.id ? bank?.id : undefined;
    this.name = bank?.name ? bank?.name : '';
    this.accountNumber = bank?.accountNumber ? bank?.accountNumber : '';
    this.routingNumber = bank?.routingNumber ? bank?.routingNumber : '';
    this.isCompleted = bank?.isCompleted ? bank?.isCompleted : false;
  }
}

export interface IApplicantAddress {
  id?: string;
  address: string;
  addressUnit: string;
  IsDeleted: boolean;
  isCompleted: boolean;
}
