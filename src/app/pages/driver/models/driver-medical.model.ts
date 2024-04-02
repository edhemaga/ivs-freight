import { Attachment } from "../../../shared/models/attachment.model";

export interface DriverMedical {
    id?: string;
    end: string;
    start: string;
    attachments?: Attachment[];
}