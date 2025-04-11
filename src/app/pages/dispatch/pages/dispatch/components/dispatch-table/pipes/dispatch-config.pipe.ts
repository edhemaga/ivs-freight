import { Pipe, PipeTransform } from '@angular/core';

// models
import { TruckTrailerConfigParams } from '../models';

@Pipe({
    name: 'dispatchConfig',
    standalone: true,
})
export class DispatchConfigPipe implements PipeTransform {
    transform(config: TruckTrailerConfigParams, type: string) {
        switch (type) {
            case 'trailer':
                const { type, truckDropdownWidth, trailerDropdownWidth } =
                    config;
                return {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Unit No.',
                    isDropdown: true,
                    placeholderInsteadOfLabel: true,
                    hideDropdownArrow: true,
                    autoFocus: true,
                    // blackInput: true,
                    hideRequiredCheck: true,
                    hideDangerMark: true,
                    hideErrorMessage: true,
                    mergeDropdownBodyWithInput: true,
                    dropdownWidthClass:
                        type === 'truck'
                            ? `w-col-${truckDropdownWidth}`
                            : `w-col-${trailerDropdownWidth}`,
                };
        }
    }
}
