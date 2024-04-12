import { Attachment } from '@shared/models/attachment.model';
import { Country } from '@shared/models/country.model';
import { DriverEndorsement } from '@pages/driver/models/driver-endorsement.model';
import { Class } from '@shared/models/class.model';
import { State } from '@shared/models/state.model';

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
