export interface ITaInput {
    name: string;
    type: string;
    label: string;
    placeholderIcon?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    pattern?: string;
    autocomplete?:string;
    minLength?:number;
    maxLength?:number;
    mask?: string;
    textTransform?: string | 'capitalize' | 'upper' | 'lower';
    customClass?: string;
}
