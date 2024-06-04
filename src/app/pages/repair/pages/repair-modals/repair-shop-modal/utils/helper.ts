import { RepairShopResponse } from "appcoretruckassist";
import { RepairShopModalService } from "../models/edit-data.model";

export function mapServices(res: RepairShopResponse, setAsInactive: boolean): RepairShopModalService[] {
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