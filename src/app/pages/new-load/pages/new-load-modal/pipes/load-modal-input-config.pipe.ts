import { Pipe, PipeTransform } from '@angular/core';

// Interfaces
import { ILoadModalConfigPipeArgs } from '@pages/new-load/pages/new-load-modal/interfaces';

// Config
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// Enumn
import { eLoadModalForm } from '@pages/new-load/pages/new-load-modal/enums';

@Pipe({
    name: 'loadModalInputConfig',
    standalone: true,
})
export class LoadModalInputConfigPipe implements PipeTransform {
    transform({ configType, isTemplate }: ILoadModalConfigPipeArgs): ITaInput {
        console.log('Calling pipe for: ', configType);

        let config: ITaInput;

        switch (configType) {
            case eLoadModalForm.NAME:
                config = {
                    name: 'Template Name',
                    label: 'Template Name',
                    type: 'text',
                    minLength: 1,
                    maxLength: 24,
                    isRequired: isTemplate,
                };

                break;

            case eLoadModalForm.COMPANY_ID:
                config = {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Company',
                    isDropdown: true,
                    dropdownWidthClass: 'w-col-230',
                    isRequired: true,
                };

                break;

            case eLoadModalForm.REFERENCE_NUMBER:
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

            case eLoadModalForm.DISPATCHER_ID:
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

            case eLoadModalForm.BROKER_ID:
                config = {
                    name: 'Input Dropdown',
                    type: 'text',
                    multipleLabel: {
                        labels: ['Broker', 'Credit'],
                        customClass: 'load-broker hide-loads',
                    },
                    isDropdown: true,
                    isRequired: !isTemplate,
                    blackInput: false,
                    textTransform: 'capitalize',
                    dropdownWidthClass: 'w-col-432',
                };

                break;

            case eLoadModalForm.BROKER_CONTACT:
                config = {
                    name: 'Input Dropdown',
                    type: 'text',
                    multipleLabel: {
                        labels: ['Contact', 'Phone'],
                        customClass: 'load-broker-contact',
                    },
                    isDropdown: true,
                    blackInput: false,
                    textTransform: 'capitalize',
                    dropdownWidthClass: 'w-col-308',
                };

                break;

            case eLoadModalForm.INVOICED_DATE:
                config = {
                    name: 'datepicker',
                    type: 'text',
                    isDropdown: true,
                    label: 'Invoiced',
                    placeholderIcon: 'date',
                    isDisabled: true,
                    customClass: 'datetimeclass',
                };

                break;

            case eLoadModalForm.BASE_RATE:
                config = {
                    name: 'price-separator',
                    type: 'text',
                    label: 'Base Rate',
                    labelInInput: true,
                    isRequired: true,
                    priceSeparator: true,
                    priceSeparatorLimitation: 6,
                    placeholderIconRightSide: 'dollar',
                    isPlaceHolderIconRightSideDynamicColor: true,
                    placeholderIconColor: 'gray',
                    inputCursorOnRightSide: true,
                    hideErrorMessage: true,
                    errorInsideInput: true,
                    hideRequiredCheck: true,
                };

                break;
        }

        return config;
    }
}
