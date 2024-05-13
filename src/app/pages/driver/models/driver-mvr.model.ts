import { Attachment } from '@shared/models/attachment.model';

export interface DriverMvr {
    id?: string;
    startDate: string;
    attachments?: Attachment[];
}
