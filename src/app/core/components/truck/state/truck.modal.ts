export interface TruckInterface{
   id:number;
   companyId:number;
   divisinFlag:number;
   companyOwned:number;
   ownerId:number;
   truckNumber:string;
   vin:string;
   year:number;
   registration:Registration[];
   fhwa:FHWA[];
   title:Title[];
   purchase:Lease_Purchase[]
   categoryId:string | number | null;
   category:string|null;
   make:string;
   model:string;
   licensePlate:string;
   licenseExpDate:string;
   bankImage:any;
   textRouting:any;
   tableRegistrationData:Registration[];
   tableFHWAData:FHWA[];
   tableTitleData:Title
   tablePurchaseData:Lease_Purchase

}

interface Registration{
    id?:string;
    startDate:string;
    endDate:string;
    state:State

}

interface State {
    key: string;
    value: string;
  }

  interface Attachment {
    url: string;
    fileName: string;
    fileItemGuid: string;
  }
 
  interface Bank {
    id?: any;
    bankLogo?: any;
    bankName?: any;
    bankLogoWide?: any;
    accountNumber?: any;
    routingNumber?: any;
  }

  interface FHWA{
      id:string;
      start:string;
      end:string;
      file?:Attachment[]
  }

  interface Title{
      id:string;
      startDate:string;
      issued:string;
  }

  interface Lease_Purchase{
       id:string;
       startDate:string;
       price:string;
       num_of_payments:number;
       down_payment:string;
       pay_period:string;
       rate:string;
       amount:string;
       next_pay:string;
       total_val:string;
       total_interest:string;
       file:Attachment[];

  }