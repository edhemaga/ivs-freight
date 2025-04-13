import { Pipe, PipeTransform } from '@angular/core';

// Interfaces
import { ILoadModalConfigPipeArgs } from '@pages/new-load/pages/new-load-modal/interfaces';

// Config
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

@Pipe({
    name: 'loadModalInputConfig',
    standalone: true,
})
export class LoadModalInputConfigPipe implements PipeTransform {
    transform({ configType, isTemplate }: ILoadModalConfigPipeArgs): ITaInput {
        console.log('Calling pipe');

        let config: ITaInput;

        switch (configType) {
            case 'templateNameConfig':
                config = {
                    name: 'Template Name',
                    label: 'Template Name',
                    type: 'text',
                    minLength: 1,
                    maxLength: 24,
                    isRequired: isTemplate,
                };

                break;
        }

        return config;
    }
}
