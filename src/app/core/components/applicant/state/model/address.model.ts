export interface Address {
   address: string;
   city: string;
   state: string;
   stateShortName: string;
   country: string;
   zipCode: number | string;
   addressUnit?: number | string;
   county?: string;
   // streetNumber?: string;
   // streetName?: string;
}
