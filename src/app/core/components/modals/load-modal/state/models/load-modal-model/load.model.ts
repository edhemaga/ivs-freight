import {
    LoadBillingAdditionalCommand,
    LoadStopCommand,
    LoadType,
} from 'appcoretruckassist';
import { Tags } from './tags.model';

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
    loadRequirements: {
        id: number;
        truckTypeId: number;
        trailerTypeId: number;
        doorType: number;
        suspension: number;
        trailerLengthId: number;
        year: number;
        liftgate: boolean;
        driverMessage: string;
    };
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
    tags: Tags[];
}
