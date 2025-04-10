import {
    eMilesMapData,
    eMilesStopColor,
} from '@pages/miles/pages/miles-map/enums';

export class MilesMapDataConstants {
    static MILES_MAP_STOP_COLORS: Record<eMilesMapData, eMilesStopColor> = {
        [eMilesMapData.PICKUP]: eMilesStopColor.PICKUP,
        [eMilesMapData.DELIVERY]: eMilesStopColor.DELIVERY,
        [eMilesMapData.FUEL]: eMilesStopColor.FUEL,
        [eMilesMapData.DEADHEAD]: eMilesStopColor.DEADHEAD,
        [eMilesMapData.REPAIR]: eMilesStopColor.REPAIR,
        [eMilesMapData.TOWING]: eMilesStopColor.TOWING,
        [eMilesMapData.PARKING]: eMilesStopColor.PARKING,
    };
}
