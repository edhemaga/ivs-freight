import { DispatchInputConfigParams } from '../../models';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class DispatchHistoryModalConfig {
    static getDispatchHistoryTimeConfig(): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Time',
            isDropdown: true,
            dropdownWidthClass: 'w-col-132',
        };
    }

    static getDispatchHistoryDispatchBoardConfig(): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Dispatch Board',
            isDropdown: true,
            dropdownWidthClass: 'w-col-192',
        };
    }

    static getDispatchHistoryTruckConfig(): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Truck',
            isDropdown: true,
            dropdownWidthClass: 'w-col-112',
        };
    }

    static getDispatchHistoryTrailerConfig(): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Trailer',
            isDropdown: true,
            dropdownWidthClass: 'w-col-132',
        };
    }

    static getDispatchHistoryDriverConfig(): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Driver',
            isDropdown: true,
            dropdownWidthClass: 'w-col-192',
        };
    }

    static getDispatchHistoryDateStartConfig(
        configData: DispatchInputConfigParams
    ): ITaInput {
        const { isInputHoverRows, groupIndex, itemIndex, groupItem } =
            configData;

        return {
            name: 'datepicker',
            type: 'text',
            isDropdown: true,
            isIconHidden: true,
            hideClear: true,
            hideErrorMessage: true,
            hideDropdownArrow: !isInputHoverRows[groupIndex][itemIndex][0],
            isInputBackgroundRemoved:
                !isInputHoverRows[groupIndex][itemIndex][0],
            blackInput:
                groupItem?.get('dateStart').value &&
                !isInputHoverRows[groupIndex][itemIndex][0],
            customClass: !isInputHoverRows[groupIndex][itemIndex][0]
                ? ''
                : 'datetimeclass',
        };
    }

    static getDispatchHistoryTimeStartConfig(
        configData: DispatchInputConfigParams
    ): ITaInput {
        const { isInputHoverRows, groupIndex, itemIndex, groupItem } =
            configData;

        return {
            name: 'timepicker',
            type: 'text',
            isDropdown: true,
            isIconHidden: true,
            hideClear: true,
            hideErrorMessage: true,
            hideDropdownArrow: !isInputHoverRows[groupIndex][itemIndex][1],
            isInputBackgroundRemoved:
                !isInputHoverRows[groupIndex][itemIndex][1],
            blackInput:
                groupItem.get('timeStart').value &&
                !isInputHoverRows[groupIndex][itemIndex][1],
            customClass: !isInputHoverRows[groupIndex][itemIndex][1]
                ? ''
                : 'datetimeclass',
        };
    }

    static getDispatchHistoryDateEndConfig(
        configData: DispatchInputConfigParams
    ): ITaInput {
        const { isInputHoverRows, groupIndex, itemIndex, groupItem } =
            configData;

        return {
            name: 'datepicker',
            type: 'text',
            isDropdown: true,
            isIconHidden: true,
            hideClear: true,
            hideErrorMessage: true,
            hideDropdownArrow: !isInputHoverRows[groupIndex][itemIndex][2],
            isInputBackgroundRemoved:
                !isInputHoverRows[groupIndex][itemIndex][2],
            blackInput:
                groupItem.get('dateEnd').value &&
                !isInputHoverRows[groupIndex][itemIndex][2],
            customClass: !isInputHoverRows[groupIndex][itemIndex][2]
                ? ''
                : 'datetimeclass',
        };
    }

    static getDispatchHistoryTimeEndConfig(
        configData: DispatchInputConfigParams
    ): ITaInput {
        const { isInputHoverRows, groupIndex, itemIndex, groupItem } =
            configData;

        return {
            name: 'timepicker',
            type: 'text',
            isDropdown: true,
            isIconHidden: true,
            hideClear: true,
            hideErrorMessage: true,
            hideDropdownArrow: !isInputHoverRows[groupIndex][itemIndex][3],
            isInputBackgroundRemoved:
                !isInputHoverRows[groupIndex][itemIndex][3],
            blackInput:
                groupItem.get('timeEnd').value &&
                !isInputHoverRows[groupIndex][itemIndex][3],
            customClass: !isInputHoverRows[groupIndex][itemIndex][3]
                ? ''
                : 'datetimeclass',
        };
    }
}
