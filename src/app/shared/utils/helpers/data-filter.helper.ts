import { ConstantStringTableComponentsEnum } from '../../../core/utils/enums/table-components.enum';

export class DataFilterHelper {
    static checkSpecialFilterArray(
        data: any,
        event: string,
        typeName?: string
    ) {
        const filteredArray = !typeName
            ? event == ConstantStringTableComponentsEnum.STATUS
                ? data?.filter((dataItem) => dataItem[event] == 0)
                : data?.filter((dataItem) => dataItem[event])
            : data?.filter(
                  (dataItem) => dataItem[typeName].name.toLowerCase() == event
              );
        return {
            selectedFilter:
                (filteredArray?.length &&
                    (typeName === 'userType' || typeName === 'type')) ??
                false,
            filteredArray,
        };
    }

    static calculateDistanceBetweenTwoCitysByCoordinates(
        lat1,
        lon1,
        lat2,
        lon2
    ) {
        const R = 6371;
        const dLat = degreesToRadians(lat2 - lat1);
        const dLon = degreesToRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degreesToRadians(lat1)) *
                Math.cos(degreesToRadians(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    }

    static getLengthNumber(data: string): string {
        const number = data.match(/\d+/);

        if (number) {
            return number[0];
        }

        return '';
    }
}

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}
