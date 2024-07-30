import { ITaInput } from "@shared/components/ta-input/config/ta-input.config";

export class DispatchParkingConfig {
    static parking: ITaInput = {
        name: 'Spot',
        type: 'text',
        autoFocus: true,
        placeholder: 'Spot',
        label: 'Spot',
        blackInput: true,
        placeholderInsteadOfLabel: true,
        hideRequiredCheck: true,
    };
}
