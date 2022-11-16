export class UserProfile {
   id: number;
   guid: string;
   companyId: number;
   username: string;
   firstName: string;
   lastName: string;
   email: string;
   password: string;
   mobile: string;
   ssn: string;
   userType: string;
   capabilities: string;
   secretKey: string;
   enabled: number;
   roles: any;
   code: any;
   smsCode: any;
   protected: number;
   createdAt: Date;
   updatedAt: Date;
   doc: UserProfileDoc;
}

export class UserProfileDoc {
   phone: string;
   address: Address;
   userType: UserType;
   addressUnit: number;
   avatar?: Avatar;
}

export interface Avatar {
   id: number;
   src: string;
}

export class Address {
   city: string;
   state: string;
   address: string;
   country: string;
   zipCode: number;
   stateShortName: string;
}

export class UserType {
   id: string;
   name: string;
}
