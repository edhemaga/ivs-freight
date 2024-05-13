import { UpdatePMTruckUnitListCommand } from 'appcoretruckassist';

export interface PmUpdateTruckUnitListCommand extends UpdatePMTruckUnitListCommand {
    pmId: number;
}
