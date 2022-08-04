export interface ITaInput {
  id?: any; // only for form array to indefier element
  name: string;
  type: string;
  label: string;
  placeholder?: string; // only for dropdown, otherwise placeholder is label !!!
  placeholderIcon?: string;
  placeholderText?: string;
  placeholderInsteadOfLabel?: boolean;
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
  blackInput?: boolean; // has only black background && input clear, no validations
  blueInputColor?: boolean; // some inputs has blue color on focus out
  incorrectInput?: boolean;
  autoFocus?: boolean;
  hideClear?: boolean;
  hideRequiredCheck?: boolean;
  hideErrorMessage?: boolean;
  thousandSeparator?: boolean; // type of input must be 'text'

  loadingSpinner?: {
    size?: string; // small, big
    color?: string; // black, gray, white, blueLight, blueDark
    isLoading?: boolean;
  };

  commands?: {
    active?: boolean;
    type?: string; // examples:  'increment-decrement', 'confirm-cancel'
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

  // Custom classes
  // - 'input-22' -> height: 22px
  // - 'input-32' -> height: 32px,
  // - 'input-30' -> height: 30px,
  // - 'datetimeclass' -> date/time pickers
  // - 'dollar-placeholderIcon' -> when input has dollar icon
  customClass?: string;

  // Pure Dropdown
  isDropdown?: boolean;
  dropdownWidthClass?: string; // Look in ta-input-drodown.scss for implementation class (width of dropdowns)

  // Label dropdown
  isDropdownLabel?: boolean;
  dropdownLabelSelected?: any;

  // MultiSelect Dropdown
  multiselectDropdown?: boolean;
  multiSelectDropdownActive?: boolean;

  // Address
  onlyCityAndZipAddress?: boolean;
  addressFlag?: string; // added text in right corner and this flag will be disabled clear button, invalid danger mark
}
