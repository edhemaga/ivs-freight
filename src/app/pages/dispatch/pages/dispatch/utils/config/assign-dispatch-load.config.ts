import { ITaInput } from "@shared/components/ta-input/config/ta-input.config";

export class AssignDispatchLoadConfig {
    static truckTrailerDriver: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Truck', 'Trailer', 'Driver', 'Rate'],
            customClass: 'load-dispatches-ttd',
        },
        isDropdown: true,
        blackInput: true,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-616  hide-after-arrow',
    };
}
