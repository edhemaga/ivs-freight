import { DriverCardTypes } from '@pages/driver/pages/driver-card-modal/models/driver-card-types.model';

export interface DriverCardData {
    active: DriverCardTypes;
    inactive: DriverCardTypes;
    applicants: DriverCardTypes;
}
