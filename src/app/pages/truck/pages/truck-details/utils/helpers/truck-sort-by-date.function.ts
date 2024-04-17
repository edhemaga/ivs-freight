import moment from 'moment';
import { TruckDetailsConfigData } from '@pages/truck/pages/truck-details/models/truck-details-config-data.model';

export class TruckSortByDate {
    static sortObjectsByExpDate(
        data: TruckDetailsConfigData[]
    ): TruckDetailsConfigData[] {
        const dateSort = Array.from(data).sort(
            (obj1: TruckDetailsConfigData, obj2: TruckDetailsConfigData) => {
                const date1 = moment(obj1.expDate).valueOf();

                const date2 = moment(obj2.expDate).valueOf();

                return date2 - date1;
            }
        );
        return dateSort;
    }
}
