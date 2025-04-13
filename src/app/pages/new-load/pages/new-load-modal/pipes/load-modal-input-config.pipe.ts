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
    transform(args: ILoadModalConfigPipeArgs): ITaInput {
        console.log('Calling pipe');

        const { configType, isTemplate } = args;

        if (configType === 'templateNameConfig') {
            return {
                name: 'Template Name',
                label: 'Template Name',
                type: 'text',
                isRequired: isTemplate,
            };
        }
    }
}
