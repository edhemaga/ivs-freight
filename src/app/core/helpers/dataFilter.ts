import { ConstantStringTableComponentsEnum } from '../utils/enums/table-components.enums';

export function checkSpecialFilterArray(
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

export function calculateDistanceBetweenTwoCitysByCoordinates(
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

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}
