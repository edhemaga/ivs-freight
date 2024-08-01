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
}
