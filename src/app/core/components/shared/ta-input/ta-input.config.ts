// customClass: 
//  - 'input-big' -> height: 32px
export interface ITaInput {
    name: string;
    type: string;
    label: string;
    placeholder?: string;    // only for dropdown, otherwise placeholder is label !!!
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
    isDropdown?: boolean;
}
