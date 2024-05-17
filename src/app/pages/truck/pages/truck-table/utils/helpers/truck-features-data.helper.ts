import { TruckShortResponse } from 'appcoretruckassist';
import { TruckTableStringEnum } from '@pages/truck/pages/truck-table/enum/truck-table-string.enum';

export class truckFeaturesDataHelper {
    static truckFeaturesData(
        data: TruckShortResponse
    ): { name: string; image: string }[] {
        const tableFeaturesArray: { name: string; image: string }[] = [];

        if (data?.doubleBunk) {
            tableFeaturesArray.push({
                name: TruckTableStringEnum.DOUBLE_BANK,
                image: TruckTableStringEnum.DOUBLE_BANK_IMG,
            });
        }

        if (data?.refrigerator) {
            tableFeaturesArray.push({
                name: TruckTableStringEnum.REFRIGERATOR,
                image: TruckTableStringEnum.REFRIGERATOR_IMG,
            });
        }

        if (data?.dcInverter) {
            tableFeaturesArray.push({
                name: TruckTableStringEnum.DC_INVERTER,
                image: TruckTableStringEnum.DC_INVERTER_IMG,
            });
        }

        if (data?.blower) {
            tableFeaturesArray.push({
                name: TruckTableStringEnum.BLOWER,
                image: TruckTableStringEnum.BLOWER_IMG,
            });
        }

        if (data?.pto) {
            tableFeaturesArray.push({
                name: TruckTableStringEnum.PTO,
                image: TruckTableStringEnum.PTO_IMG,
            });
        }

        if (data?.headacheRack) {
            tableFeaturesArray.push({
                name: TruckTableStringEnum.HEADACHE_RACK,
                image: TruckTableStringEnum.HEADACHE_RACK_IMG,
            });
        }

        if (data?.dashCam) {
            tableFeaturesArray.push({
                name: TruckTableStringEnum.DASH_CAM,
                image: TruckTableStringEnum.DASH_CAM_IMG,
            });
        }

        return tableFeaturesArray;
    }
}
