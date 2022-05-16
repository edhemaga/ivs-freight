export interface TruckInterface {
  id: number;
  companyId: number;
  divisinFlag: number;
  companyOwned: number;
  ownerId: number;
  truckNumber: string;
  vin: string;
  year: number;
  categoryId: string | number | null;
  category: string | null;
  make:string;
  model:string;
  licensePlate:string;
  licenseExpData:string;
  colorName:string;
  colorCode:string;
  svgIcons:string;
  svgClass:string;
  length:string | number| null;
  fhwaInsepction:string;
  status:number;
  used:number;
  canBeUsedByCompany:number;
  location:string | null;
  longgitude:string | null;
  latitude:string | null;
  devideId:number | null;
  uniqueId:number | null;
  percentage: number | null;
  doc:any;
  mileage: number | null;
  additionData:AdditionalData;
  registrationData:Registration[];
  fhwaData:FHWA[];
  titleData:Title[];
  purchaseData:Lease_Purchase[];
  ownerData:Owner;
  note:any;
  tableRegistrationData:Registration;
  tableFhwaData:FHWA
  tableTitleData:Title
  tableLeaseData:Lease_Purchase
  isSelected:boolean;
}

interface Registration {
  id?: string;
  startDate: string;
  endDate: string;
  state: State[]
  attachemts?:Attachment[]
}
interface AdditionalData{
  grossWeight:string;
  emptyWeight:string;
  startingMileage:string;
  axles:number;
  tireSize:string;
  ipass_ezpass:number;
  insurancePolicy:number;
}

interface Owner{
  company:string;
  commision:string;
}
interface OwnerHistory{
  id:number;
  from:string;
  to:string;
  duration:string;
}

interface InspectionDate{
  id:string;
  startDate:string;
  attachments:Attachment[];
 
}
interface Attachment {
  url: string;
  fileName: string;
  fileItemGuid: string;
}

interface activityHistory{
  id:string;
  dialog:boolean;
  header:string;
  startDate:string;
  endDate:string;
  ownerId:number;
  showDelete: boolean;
  showDialog: boolean;
  endDateShort: string | null;
  startDateShort: string;
  showEndDateAction: boolean;
  showStartDateAction: boolean;
}

interface State{
  key:string;
  value:string;
}
interface FHWA {
  id: string;
  start: string;
  end: string;
  file?: Attachment[]
}
interface LicenseData{
  id:string;
  startDate:string;
  endDate:string;
  attachments:Attachment[];
  licensePlate:string;
}
interface Title {
  id: string;
  startDate: string;
  issued: string;
}

interface Lease_Purchase {
  id: string;
  startDate: string;
  price: string;
  num_of_payments: number;
  down_payment: string;
  pay_period: string;
  rate: string;
  amount: string;
  next_pay: string;
  total_val: string;
  total_interest: string;
  file: Attachment[];

}