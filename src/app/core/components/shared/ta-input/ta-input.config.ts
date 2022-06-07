export interface ITaInput {
  name: string;
  type: string;
  label: string;
  placeholder?: string; // only for dropdown, otherwise placeholder is label !!!
  placeholderIcon?: string;
  placeholderText?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  pattern?: string;
  autocomplete?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: any; // step for input type="number";
  mask?: string;
  textTransform?: string | 'capitalize' | 'uppercase' | 'lowercase';
  textAlign?: string | 'center';
  customClass?: string; // 'input-big' -> height: 32px
  autoFocus?: boolean; // focus first input in form,
  hideClear?:boolean;
  hideErrorMessage?: boolean;
  // Dropdown
  isDropdown?: boolean;
  dropdownWidthClass?: string; // Look in ta-input-drodown.scss for implementation class
  // MultiSelect Dropdown
  multiselectDropdown?: boolean;
  multiSelectDropdownActive?: boolean;
}
