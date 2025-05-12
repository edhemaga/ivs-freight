import { Pipe, PipeTransform } from '@angular/core';

// Interfaces
import { ILoadModalStopsConfigPipeArgs } from '@pages/new-load/pages/new-load-modal/interfaces';

// Enum
import { eLoadModalStopsForm } from '@pages/new-load/pages/new-load-modal/enums';
import { ICaInput } from 'ca-components';

@Pipe({
    name: 'loadStopInputConfig',
    standalone: true,
})
export class LoadStopInputConfigPipe implements PipeTransform {
    transform({
        configType,
        isDateRange,
        isAppointment,
    }: ILoadModalStopsConfigPipeArgs): ICaInput {
        console.log('Calling pipe for: ', configType);

        let config: ICaInput;

        switch (configType) {
            case eLoadModalStopsForm.SHIPPER_ID:
                config = {
                    name: 'Input Dropdown',
                    type: 'text',
                    multipleLabel: {
                        labels: ['Shipper', 'Address'],
                        customClass: 'load-shipper',
                    },
                    isDropdown: true,
                    isRequired: true,
                    blackInput: false,
                    textTransform: 'uppercase',
                    dropdownWidthClass: 'w-col-608 load-shipper-stops',
                };
                break;

            case eLoadModalStopsForm.SHIPPER_CONTACT_ID:
                config = {
                    name: 'Input Dropdown',
                    type: 'text',
                    multipleLabel: {
                        labels: ['Contact', 'Phone'],
                        customClass: 'load-broker-contact',
                    },
                    searchinGroupIndex: 'contacts',
                    isDropdown: true,
                    blackInput: false,
                    textTransform: 'capitalize',
                    dropdownWidthClass: 'w-col-308',
                };
                break;

            case eLoadModalStopsForm.DATE_FROM:
                // If we don't have date to show only date
                config = {
                    name: 'datepicker',
                    type: 'text',
                    isDropdown: true,
                    label: isDateRange ? 'Start Date' : 'Date',
                    placeholderIcon: 'date',
                    customClass: 'datetimeclass',
                    isRequired: true,
                };
                break;

            case eLoadModalStopsForm.DATE_TO:
                config = {
                    name: 'datepicker',
                    type: 'text',
                    isDropdown: true,
                    label: 'End Date',
                    placeholderIcon: 'date',
                    customClass: 'datetimeclass',
                    isRequired: true,
                };
                break;

            case eLoadModalStopsForm.TIME_FROM:
                config = {
                    name: 'timepicker',
                    type: 'text',
                    label: isAppointment ? 'Time' : 'From',
                    placeholderIcon: 'time',
                    isDropdown: true,
                    isRequired: true,
                    isFromDate: true,
                    customClass: 'datetimeclass',
                };
                break;

            case eLoadModalStopsForm.TIME_TO:
                config = {
                    name: 'timepicker',
                    type: 'text',
                    label: 'To',
                    placeholderIcon: 'time',
                    isDropdown: true,
                    isRequired: !isAppointment,
                    isDisabled: isAppointment,
                    isFromDate: true,
                    customClass: 'datetimeclass',
                };
                break;
        }

        return config;
    }
}
