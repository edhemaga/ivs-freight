import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class DispatchConfig {
    static getDispatchAddressConfig(): ITaInput {
        return {
            name: 'Address',
            type: 'text',
            label: 'Location',
            placeholder: 'Location',
            textTransform: 'capitalize',
            dropdownWidthClass: 'w-col-151',
            minLength: 12,
            maxLength: 256,
            autoFocus: true,
            placeholderInsteadOfLabel: true,
            hideErrorMessage: true,
            blackInput: true,
        };
    }
}
