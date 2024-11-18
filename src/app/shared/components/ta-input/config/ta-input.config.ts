export interface IMultipleInput {
    id?: any;
    value: string | number;
    second_value?: string | number;
    logoName?: string;
    isImg?: boolean;
    isSvg?: boolean;
    folder?: string;
    subFolder?: string;
    logoType?: string;
    isOwner?: boolean;
    isProgressBar?: boolean;
    isCounter?: boolean;
}

export interface ITaInput {
    id?: any; // only for form array to indefier element
    name: string;
    type: string;
    label?: string;
    labelInInput?: boolean;
    placeholder?: string; // only for dropdown, otherwise placeholder is label !!!
    placeholderIcon?: string;
    placeholderIconRightSide?: string;
    placeholderIconFolllowTextOnRightSide?: string;
    placeholderIconColor?: string;
    placeholderText?: string;
    placeholderInsteadOfLabel?: boolean;
    inputCursorOnRightSide?: boolean;
    isRequired?: boolean;
    isDisabled?: boolean;
    autocomplete?: string;
    showCount?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    step?: any; // step for input type="number";
    mask?: string; // only for phone type of input
    textTransform?: 'capitalize' | 'uppercase' | 'lowercase';
    textAlign?: string | 'center';
    blackInput?: boolean; // has only black background && input clear, no validations
    blueInput?: boolean;
    incorrectInput?: boolean;
    dangerMark?: boolean;
    autoFocus?: boolean;
    hideClear?: boolean;
    hideRequiredCheck?: boolean;
    hideErrorMessage?: boolean;
    hideDangerMark?: boolean;
    hideDropdownArrow?: boolean;
    errorInsideInput?: boolean; 
    removeInput?: boolean;
    readOnly?: boolean;
    thousandSeparator?: boolean; // type of input must be 'text'
    priceSeparator?: boolean;
    priceSeparatorLimitation?: number; // 7 - 999,999.00 ; 6 - 99,000.00 ; 5 - 9,000.00 itd... (must including and comma)
    loadingSpinner?: {
        size?: string; // small, big
        color?: string; // black, gray, white, blueLight, blueDark
        isLoading?: boolean;
    };
    addressFlag?: string; // added text in right corner and this flag will be disabled clear button, invalid danger mark
    customClass?: string; // - 'datetimeclass' -> date/time pickers, 'datetimeclass dark -> date/time pickers dark
    isIconInput?: boolean; // display icon instead of regular input
    isValidIcon?: boolean; // display icon instead of regular input
    inputIcon?: string; // display icon instead of regular input

    // ***************** Multiple Inputs & Labels *****************
    multipleInputValues?: {
        options: IMultipleInput[];
        customClass: string;
    };
    multipleLabel?: {
        labels: string[]; // ['Driver', 'Truck #', 'Trailer #']
        customClass: string;
    };
    isInputBackgroundRemoved?: boolean;
    isBlueText?: boolean;

    // ***************** Input Actions (confirm-cancel buttons) *****************
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
        thirdCommand?: {
            popup?: {
                name?: string;
                backgroundColor?: string;
            };
            name?: string;
            svg?: string;
        };
        setTimeout?: number; // if must keep focus on input
        blueCommands?: boolean;
    };
    defaultValue?: string; // default input value for Reset command

    // ***************** DROPDOWNS *****************

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
    isInvalidSearchInDropdown?: boolean;
    selectedDropdown?: boolean;
    mergeDropdownBodyWithInput?: boolean;
    hideAllItemsInInputDropdown?: boolean;
    isBlueDropdown?: boolean;
    isItemSelected?: boolean;
    isDisplayingCustomPeriodRange?: boolean;
    isUsingCustomPeriodRange?: boolean

    // Address Dropdown
    isDispatchLocationDropdown?: boolean;

    // Label dropdown
    dropdownLabel?: boolean;
    dropdownLabelNew?: boolean;

    // MultiSelect Dropdown
    multiselectDropdown?: boolean;
    multiSelectDropdownActive?: boolean;
    multiSelectItemRange?: boolean;

    // DateTime Picker
    isFromDate?: boolean;
    hideColorValidations?: boolean; // regular color for inputs, no blue validation
    expiredDateInvalid?: boolean; // accept only dates that didn't expire
    isFutureDateDisabled?: boolean; // disabled future dates
    fixedPlacholder?: string;
    statusStyle?: boolean;
    isIconHidden?: boolean;
    isRemovedIconMovedOnLeft?: boolean;
    removeLeadingZero?: boolean;
    negativeLeadingZero?: boolean;
    isHoverRow?: boolean;
    minutesGapFive?: boolean;
}
