import {
    LoadBillingAdditionalCommand,
    LoadStatus,
    LoadStopCommand,
    LoadType,
} from 'appcoretruckassist';
import { Tags } from './tags.model';

export interface Load {
    id?: number;
    type?: LoadType;
    loadNumber?: string;
    loadTemplateId?: number;
    dispatcherId: number;
    companyId?: number;
    dispatchId: number;
    dateCreated: string;
    status?: LoadStatus;
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
        year: number | string;
        liftgate: boolean;
        driverMessage: string;
    };
    stops: LoadStopCommand[];
    baseRate: number;
    adjustedRate: number;
    driverRate: number;
    advancePay?: number;
    additionalBillingRates: LoadBillingAdditionalCommand[];
    files: Blob[];
    tags: Tags[];
    filesForDeleteIds?: number[];
    comment?: {
        id: number;
        commentContent: string;
    };
    deleteComment?: {
        id: number;
    };
    note: string;
    commentId?: number;
    commentCommentContent?: string;
    emptyMiles?: number;
    totalMiles: number;
    totalHours: number;
    totalMinutes: number;
}
