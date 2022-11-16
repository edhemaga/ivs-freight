export class DrugAndAlcohol {
  id?: number;
  drugTest: boolean;
  applicantId?: string;
  motorCarrier: string;
  phone: string;
  address: string;
  addressUnit: string;
  sapName: string;
  sapPhone: string;
  sapAddress: string;
  sapAddressUnit: string;
  isAgreement: boolean;
  isCompleted: boolean;

  constructor(drugAndAlcohol?: DrugAndAlcohol) {
    this.id = drugAndAlcohol?.id ? drugAndAlcohol.id : undefined;
    this.drugTest = drugAndAlcohol?.drugTest ? drugAndAlcohol.drugTest : false;
    this.applicantId = drugAndAlcohol?.applicantId
      ? drugAndAlcohol.applicantId
      : undefined;
    this.motorCarrier = drugAndAlcohol?.motorCarrier
      ? drugAndAlcohol.motorCarrier
      : '';
    this.phone = drugAndAlcohol?.phone ? drugAndAlcohol.phone : '';
    this.address = drugAndAlcohol?.address ? drugAndAlcohol.address : '';
    this.addressUnit = drugAndAlcohol?.addressUnit
      ? drugAndAlcohol.addressUnit
      : '';
    this.sapName = drugAndAlcohol?.sapName ? drugAndAlcohol.sapName : '';
    this.sapPhone = drugAndAlcohol?.sapPhone ? drugAndAlcohol.sapPhone : '';
    this.sapAddress = drugAndAlcohol?.sapAddress
      ? drugAndAlcohol.sapAddress
      : '';
    this.sapAddressUnit = drugAndAlcohol?.sapAddressUnit
      ? drugAndAlcohol.sapAddressUnit
      : '';
    this.isAgreement = drugAndAlcohol?.isAgreement
      ? drugAndAlcohol.isAgreement
      : false;
    this.isCompleted = drugAndAlcohol?.isCompleted
      ? drugAndAlcohol.isCompleted
      : true;
  }
}
