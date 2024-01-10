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
    stops: LoadStopCommand[];
    baseRate: number;
    adjustedRate: number;
    driverRate: number;
    advancePay: number;
    additionalBillingRates: LoadBillingAdditionalCommand[];
    files: Blob[];
    tags: Tags[];
    note: string;
    emptyMiles: number;
    totalMiles: number;
    totalHours: number;
    totalMinutes: number;
}
