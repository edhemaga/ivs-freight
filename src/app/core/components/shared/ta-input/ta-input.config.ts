export interface IMultipleInput {
    value: string;
    logoName?: string;
    isImg?: boolean;
    isSvg?: boolean;
    folder?: string;
    subFolder?: string;
    logoType?: string;
    isOwner?: boolean;
}

export interface ITaInput {
    id?: any; // only for form array to indefier element
    name: string;
    type: string;
    label?: string;
    multipleInputValues?: {
        options: IMultipleInput[];
        customClass: string;
    };
    multipleLabel?: {
        labels: string[]; // ['Driver', 'Truck #', 'Trailer #']
        customClass: string;
    };
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
    textTransform?: 'capitalize' | 'uppercase' | 'lowercase';
    textAlign?: string | 'center';
    blackInput?: boolean; // has only black background && input clear, no validations
    blueInputColor?: boolean; // some inputs has blue color on focus out (example in repair-order)
    incorrectInput?: boolean;
    dangerMark?: boolean;
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
    // - 'input-26' = DEFAULT = -> height: 26px,
    // - 'input-30' -> height: 30px,
    // - 'input-32' -> height: 32px,
    // - 'line-input-26' -> centered elements into input, when input not a part of form tag or part of boostrap popover
    // - 'line-input-26-in-card' -> when input implement in custom-card and not aligned
    // - 'datetimeclass' -> date/time pickers
    // - 'dollar-placeholderIcon' -> when input has dollar icon
    customClass?: string;

    // Pure Dropdown
    isDropdown?: boolean;
    dropdownWidthClass?: string; // Look in ta-input-drodown.scss for implementation class (width of dropdowns)
    dropdownImageInput?: {
        withText: boolean;
        svg: boolean;
        image: boolean;
        url: string;
        nameInitialsInsteadUrl?: string; // if url does not exist, but must render initials of name
        template?: string; // truck, trailer...
        color?: string; // colors store in backe-end dynamicly
        class?: string; // colors store in front-end
        remove?: boolean; // remove svg in focus mode and when user are typing
    };

    // Label dropdown
    dropdownLabel?: boolean;
    dropdownLabelNew?: boolean;

    // MultiSelect Dropdown
    multiselectDropdown?: boolean;
    multiSelectDropdownActive?: boolean;

    // Address
    addressFlag?: string; // added text in right corner and this flag will be disabled clear button, invalid danger mark\
}
