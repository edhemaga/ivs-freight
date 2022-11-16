export interface CompanyInfoModel {
   name: string;
   phone: string;
   usDot: string | number;
   address: {
      address: string;
      addressUnit: string;
      city: string;
      country: string;
      state: string;
      stateShortName: string;
      street: string;
      streetNumber: string;
      zipCode: string;
   };
}
