import { DriverModel } from '@pages/driver/pages/driver-table/models/driver.model';

export interface TableBodyActions {
    data?: DriverModel;
    id?: number;
    type: string;
}
