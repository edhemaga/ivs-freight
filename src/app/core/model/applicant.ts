export interface ApplicantData {
  id: string;
  active: boolean;
  name: string;
  dob: string;
  phone: string;
  email: string;
  app: number | boolean;
  mvr: number | boolean;
  psp: number | boolean;
  sph: number | boolean;
  ssn: number | boolean;
  medical: any;
  cdl: any;
  rev: number | boolean;
  note: string;
  files: any[];
}

export interface InviteApplicant {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  addressUnit: string;
  country: string;
  logo: string;
  companyPhone: string;
  webUrl: string;
  note: string;
  createdBy: string;
}

export interface IApplicant {
  id?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dob?: Date;
  code: string;
  phone: string;
  email: string;
  address: string;
  addressUnit: string;
}
