import { RepairShopResponse } from 'appcoretruckassist';
import {
    CreateShopModel,
    OpenHours,
    RepairShopModalService,
} from '../models/edit-data.model';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

export function mapServices(
    res: RepairShopResponse,
    setAsInactive: boolean
): RepairShopModalService[] {
    // TODO: TYPE
    return res.serviceTypes.map((item) => {
        return {
            id: item.serviceType.id,
            serviceType: item.serviceType.name,
            svg: `assets/svg/common/repair-services/${item.logoName}`,
            active: setAsInactive ? false : item.active,
        };
    });
}

export function createOpenHour(
    day: OpenHours,
    formBuilder: UntypedFormBuilder
): UntypedFormGroup {
    return formBuilder.group({
        isWorkingDay: [day.isWorkingDay],
        dayLabel: [day.dayLabel],
        startTime: [day.startTime],
        endTime: [day.endTime],
    });
}