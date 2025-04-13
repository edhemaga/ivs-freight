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

            case 'companyInputConfig':
                config = {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Company',
                    isDropdown: true,
                    dropdownWidthClass: 'w-col-230',
                    isRequired: true,
                };

                break;

            case 'referenceNumberConfig':
                config = {
                    name: 'Reference No.',
                    type: 'text',
                    label: 'Reference No.',
                    isRequired: !isTemplate,
                    isDisabled: isTemplate,
                    textTransform: 'uppercase',
                    minLength: 2,
                    maxLength: 16,
                };

                break;

            case 'dispatcherInputConfig':
                config = {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Dispatcher',
                    isDropdown: true,
                    isRequired: !isTemplate,
                    dropdownImageInput: {
                        withText: true,
                        svg: false,
                        image: true,
                        url: 'logoName',
                        template: 'user',
                    },
                    textTransform: 'capitalize',
                    dropdownWidthClass: 'w-col-230 load-dispatcher-wrapper',
                };

                break;
        }

        return config;
    }
}
