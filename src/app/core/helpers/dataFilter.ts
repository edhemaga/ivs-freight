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
