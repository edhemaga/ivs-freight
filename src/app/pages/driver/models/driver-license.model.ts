import { Attachment } from 'src/app/shared/models/attachment.model';
import { Country } from 'src/app/shared/models/country.model';
import { DriverEndorsement } from './driver-endorsement.model';
import { Class } from 'src/app/shared/models/class.model';
import { State } from 'src/app/shared/models/state.model';

export interface DriverLicense {
    id: string;
    note?: any;
    class: Class;
    state: State;
    number: string;
    country: Country;
    endDate: string;
    startDate: string;
    attachments: Attachment[];
    endorsements: DriverEndorsement[];
    restrictions: any;
}
