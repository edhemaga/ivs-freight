import { ConstantStringTableComponentsEnum } from '../utils/enums/table-components.enums';

export function checkSpecialFilterArray(
    data: any,
    event: string,
    typeName?: string
) {
    const filteredArray = !typeName
        ? event == ConstantStringTableComponentsEnum.STATUS
            ? data?.filter((e: any) => e[event] == 0)
            : data?.filter((e: any) => e[event])
        : data?.filter((e: any) => e[typeName].name.toLowerCase() == event);
    console.log(typeName);
    return {
        selectedFilter:
            (filteredArray?.length &&
                (typeName == 'userType' || typeName == 'type')) ??
            false,
        filteredArray,
    };
}
