import {
    LoadBillingAdditionalCommand,
    LoadStopCommand,
    LoadType,
} from 'appcoretruckassist';

export interface Load {
    type: LoadType;
    loadNumber: string;
    loadTemplateId: number;
    dispatcherId: number;
    companyId: number;
    dispatchId: number;
    dateCreated: string;
    brokerId: number;
    brokerContactId: number;
    referenceNumber: string;
    generalCommodity: number;
    weight: number;
    loadRequirementsId: number;
    loadRequirementsTruckTypeId: number;
    loadRequirementsTrailerTypeId: number;
    loadRequirementsDoorType: number;
    loadRequirementsSuspension: number;
    loadRequirementsTrailerLengthId: number;
    loadRequirementsYear: number;
    loadRequirementsLiftgate: boolean;
    loadRequirementsDriverMessage: string;
    note: string;
    baseRate: number;
    adjustedRate: number;
    driverRate: number;
    advancePay: number;
    totalMiles: number;
    totalHours: number;
    totalMinutes: number;
    additionalBillingRates: LoadBillingAdditionalCommand[];
    stops: LoadStopCommand[];
    files: Blob[];
    tags: any[];
}
