export interface Address {
  address: string;
  city: string;
  state: string;
  stateShortName: string;
  country: string;
  zipCode: number | string;
  addressUnit?: number | string;
  streetNumber?: string;
  streetName?: string;
}
