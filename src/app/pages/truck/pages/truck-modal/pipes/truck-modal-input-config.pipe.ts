import { Pipe, PipeTransform } from '@angular/core';

// models
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { ITruckModalConfigPipeArgs } from '@pages/truck/pages/truck-modal/models';

@Pipe({
    standalone: true,
    name: 'truckModalInputConfig',
})
export class TruckModalInputConfigPipe implements PipeTransform {
    constructor() {}

    transform(args: ITruckModalConfigPipeArgs): ITaInput {
        const { configType, loadingVinDecoder } = args;

        let inputConfig: ITaInput;

        switch (configType) {
            case 'yearInputConfig':
                inputConfig = {
                    name: 'Year',
                    type: 'text',
                    label: 'Year',
                    isRequired: true,
                    minLength: 4,
                    maxLength: 4,
                };
                break;
            case 'vinInputConfig':
                inputConfig = {
                    name: 'vin-number',
                    type: 'text',
                    label: 'VIN',
                    isRequired: true,
                    textTransform: 'uppercase',
                    maxLength: 17,
                    minLength: 5,
                    loadingSpinner: {
                        size: 'small',
                        color: 'white',
                        isLoading: loadingVinDecoder,
                    },
                };
                break;
                
            default:
                return;
        }

        return inputConfig;
    }
}
