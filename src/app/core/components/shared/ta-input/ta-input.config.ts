export interface ITaInput {
    name: string;
    type: string;
    label: string;
    placeholder: string;
    specificPlaceholder?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    pattern?: string
}
