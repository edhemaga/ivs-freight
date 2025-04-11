import { eMilesStopColor } from '@pages/miles/pages/miles-map/enums';
import { eSharedString } from '@shared/enums';

export class MilesMapDataConstants {
    static MILES_MAP_STOP_COLORS: Partial<
        Record<eSharedString, eMilesStopColor>
    > = {
        [eSharedString.PICKUP]: eMilesStopColor.PICKUP,
        [eSharedString.DELIVERY]: eMilesStopColor.DELIVERY,
        [eSharedString.FUEL]: eMilesStopColor.FUEL,
        [eSharedString.DEADHEAD]: eMilesStopColor.DEADHEAD,
        [eSharedString.REPAIR]: eMilesStopColor.REPAIR,
        [eSharedString.TOWING]: eMilesStopColor.TOWING,
        [eSharedString.PARKING]: eMilesStopColor.PARKING,
    };
}
