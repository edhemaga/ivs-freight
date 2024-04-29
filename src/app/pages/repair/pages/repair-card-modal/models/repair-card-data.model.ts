import { RepairCardTypes } from '@pages/repair/pages/repair-card-modal/models/repair-card-types.model';

export interface RepairCardData {
    active: RepairCardTypes;
    inactive: RepairCardTypes;
    repair_shop: RepairCardTypes;
}
