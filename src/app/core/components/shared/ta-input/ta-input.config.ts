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
  mask?: string; // only for phone type of input
  textTransform?: string | 'capitalize' | 'uppercase' | 'lowercase';
  textAlign?: string | 'center';
  // Custom classes
  // 'input-big' -> height: 32px,
  // 'datetimeclass' -> date/time pickers
  // 'dollar-placeholderIcon' -> when input has dollar icon
  customClass?: string;
  autoFocus?: boolean; // focus first input in form,
  hideClear?: boolean;
  hideRequiredCheck?: boolean;
  hideErrorMessage?: boolean;
  thousandSeparator?: boolean; // type of input must be string
  commands?: {
    active?: boolean;
    type?: string; // 'increment-decrement', 'confirm-cancel'
    firstCommand?: {
      popup?: {
        name?: string;
        backgroundColor?: string;
      };
      name?: string;
      svg?: string;
    };
    secondCommand?: {
      popup?: {
        name?: string;
        backgroundColor?: string;
      };
      name?: string;
      svg?: string;
    };
    setTimeout?: number; // if must keep focus on input
  };
  // Dropdown
  isDropdown?: boolean;
  dropdownWidthClass?: string; // Look in ta-input-drodown.scss for implementation class (width of dropdowns)
  // Label dropdown
  isDropdownLabel?: boolean;
  dropdownLabelSelected?: any;
  // MultiSelect Dropdown
  multiselectDropdown?: boolean;
  multiSelectDropdownActive?: boolean;
  // Black input only
  blackInput?: boolean; // has only black background && input clear, no validations
  // Blue Input Text
  blueInputColor?: boolean; // some inputs has blue color on focus out
  // Specific label input
  placeholderInsteadOfLabel?: boolean;
}
