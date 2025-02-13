import { Pipe, PipeTransform } from '@angular/core';

// Models
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

@Pipe({
    name: 'settingsBasicModalInputConfig',
})
export class SettingsBasicModalInputConfigPipe implements PipeTransform {
    transform(value: any, args?: any): ITaInput {
        return null;
    }
}
