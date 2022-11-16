export interface LicenseModel {
    id?: number | null;
    licenseNumber: string | null;
    country: string;
    state: string;
    classType: string;
    expDate: string;
    endorsments?: any;
    restrictions?: any;
    isEditingLicense: boolean;
    licenseReview: any;
}

export class CDLInformation {
    applicantId?: string;
    id?: number;
    permit?: boolean;
    explain: string;
    licences: License[];

    constructor(cdl?: CDLInformation) {
        this.applicantId = cdl ? cdl.applicantId : undefined;
        this.id = cdl ? cdl.id : undefined;
        this.permit = cdl ? cdl.permit : false;
        this.explain = cdl ? cdl.explain : '';
        this.licences = cdl ? cdl.licences : [];
    }
}
export class License {
    id?: number;
    license: string;
    countryType: string;
    stateId: string;
    classType: any;
    expDate?: string;
    endorsments: string;
    restrictions: string;
    isDeleted: boolean;

    constructor(license?: License) {
        this.id = license ? license.id : undefined;
        this.license = license ? license.license : '';
        this.countryType = license ? license.countryType : '';
        this.stateId = license ? license.stateId : '';
        this.classType = license ? license.classType : '';
        this.expDate = license ? license.expDate : undefined;
        this.endorsments = license ? license.endorsments : '';
        this.restrictions = license ? license.restrictions : '';
        this.isDeleted = license ? license.isDeleted : false;
    }
}
