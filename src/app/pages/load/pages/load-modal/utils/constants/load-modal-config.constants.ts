import { FormControl } from '@angular/forms';
import { ICaInput } from '@ca-shared/components/ca-input/config';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { eStringPlaceholder } from '@shared/enums';
import { TrailerTypeResponse, TruckTypeResponse } from 'appcoretruckassist';

export class LoadModalConfig {
    static LOAD_DISPATCHES_TTD_INPUT_CONFIG: ICaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Truck', 'Trailer', 'Driver', 'Rate'],
            customClass: 'load-dispatches-ttd',
        },
        isDropdown: true,
        blackInput: false,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-616  hide-after-arrow',
    };

    static LOAD_BROKER_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Broker', 'Credit'],
            customClass: 'load-broker hide-loads',
        },
        isDropdown: true,
        isRequired: true,
        blackInput: false,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-432',
    };

    static LOAD_BROKER_CONTACTS_INPUT_CONFIG: ICaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Contact', 'Phone'],
            customClass: 'load-broker-contact',
        },
        isDropdown: true,
        blackInput: false,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-308',
    };

    static LOAD_PICKUP_SHIPPER_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Shipper', 'Address'],
            customClass: 'load-shipper',
        },
        isDropdown: true,
        isRequired: true,
        blackInput: false,
        textTransform: 'uppercase',
        dropdownWidthClass: 'w-col-608 load-shipper-stops',
    };

    static LOAD_PICKUP_SHIPPER_CONTACTS_INPUT_CONFIG: ICaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Contact', 'Phone'],
            customClass: 'load-shipper-contact',
        },
        isDropdown: true,
        isDisabled: false,
        blackInput: false,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-308',
    };

    static LOAD_DELIVERY_SHIPPER_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Shipper', 'Address'],
            customClass: 'load-shipper',
        },
        isDropdown: true,
        isRequired: true,
        blackInput: false,
        textTransform: 'uppercase',
        dropdownWidthClass: 'w-col-608 load-shipper-stops',
    };

    static LOAD_DELIVERY_SHIPPER_CONTACTS_INPUT_CONFIG: ICaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Contact', 'Phone'],
            customClass: 'load-shipper-contact',
        },
        isDropdown: true,
        isDisabled: true,
        blackInput: false,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-370',
    };

    static LOAD_COMPANY_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Company',
        isDropdown: true,
        dropdownWidthClass: 'w-col-230',
    };

    static LOAD_DISPATCHER_CONFIG: ICaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Dispatcher',
        isDropdown: true,
        isRequired: true,
        dropdownImageInput: {
            withText: true,
            svg: false,
            image: true,
            url: 'logoName',
            template: 'user',
            iconsPath: eStringPlaceholder.EMPTY,
            activeItemIconKey: 'logoName',
        },
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-230 load-dispatcher-wrapper',
    };

    static LOAD_COMMODITY_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Commodity',
        isDropdown: true,
        dropdownWidthClass: 'w-col-142',
        blackInput: false,
        customClass: 'hazardous-dropdown',
    };

    static LOAD_WEIGHT_CONFIG: ITaInput = {
        name: 'Weight',
        type: 'text',
        label: 'Weight',
        placeholderIcon: 'weight',
        thousandSeparator: true,
    };

    static LOAD_TRAILER_LENGTH_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Length',
        isDropdown: true,
        dropdownWidthClass: 'w-col-100',
    };

    static LOAD_DOOR_TYPE_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Door Type',
        isDropdown: true,
        dropdownWidthClass: 'w-col-120',
    };

    static LOAD_SUSPENSION_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Suspension',
        isDropdown: true,
        dropdownWidthClass: 'w-col-150',
    };

    static LOAD_YEAR_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Year',
        isDropdown: true,
        dropdownWidthClass: 'w-col-117',
    };

    static LOAD_TEMPLATE_CONFIG: ITaInput = {
        name: 'Template Name',
        type: 'text',
        label: 'Template Name',
        isRequired: true,
    };

    static LOAD_MAIN_COMPANY_CONFIG: ITaInput = {
        name: 'Company',
        type: 'text',
        label: 'Company',
        isDisabled: true,
        isRequired: true,
        textTransform: 'uppercase',
    };

    static LOAD_PICKUP_END_DATE: ITaInput = {
        name: 'datepicker',
        type: 'text',
        isDropdown: true,
        label: 'End Date',
        placeholderIcon: 'date',
        customClass: 'datetimeclass',
    };

    static LOAD_EXTRA_STOPS_TO_DATE: ITaInput = {
        name: 'datepicker',
        type: 'text',
        isDropdown: true,
        label: 'Date To',
        placeholderIcon: 'date',
        customClass: 'datetimeclass',
    };

    static LOAD_DELIVERY_DATE_TO: ITaInput = {
        name: 'datepicker',
        type: 'text',
        isDropdown: true,
        label: 'Date To',
        placeholderIcon: 'date',
        customClass: 'datetimeclass',
    };
    static LOAD_BASE_RATE: ITaInput = {
        name: 'price-separator',
        type: 'text',
        label: 'Base Rate',
        labelInInput: true,
        isRequired: true,
        priceSeparator: true,
        priceSeparatorLimitation: 6,
        placeholderIconRightSide: 'dollar',
        isPlaceHolderIconRightSideDynamicColor: true,
        placeholderIconColor: 'gray',
        inputCursorOnRightSide: true,
        hideErrorMessage: true,
        errorInsideInput: true,
        hideRequiredCheck: true,
    };
    static LOAD_BILLING_DROPDOWN: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Additional',
        isDropdown: true,
        labelInInput: true,
        autoFocus: true,
        dropdownWidthClass: 'w-col-200',
        readOnly: true,
    };

    static LOAD_PAYMENT_TYPE: ITaInput = {
        name: 'payType',
        type: 'text',
        label: 'Pay Type',
        labelInInput: true,
        placeholderIconRightSide: 'billing',
        placeholderIconColor: 'blue',
        inputCursorOnRightSide: true,
        hideErrorMessage: true,
        hideRequiredCheck: true,
        hideDangerMark: true,
        removeInput: true,
        dropdownWidthClass: 'w-col-208',
    };

    static LOAD_PAYDATE: ITaInput = {
        name: 'datepicker',
        type: 'text',
        label: 'Date',
        labelInInput: true,
        placeholderIcon: 'date',
        customClass: 'datetimeclass',
    };

    static LOAD_PAYMENT_DROPDOWN: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Additional',
        isDropdown: true,
        labelInInput: true,
        autoFocus: true,
        dropdownWidthClass: 'w-col-208',
        readOnly: true,
    };

    static getInvoiceDate(isRequired: boolean, isDisabled: boolean): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            isDropdown: true,
            label: 'Invoiced',
            placeholderIcon: 'date',
            isRequired,
            isDisabled,
            customClass: 'datetimeclass',
        };
    }
    static LOAD_REFERENCE_NUMBER: ITaInput = {
        name: 'Ref Number',
        type: 'text',
        label: 'Reference No.',
        isRequired: true,
        textTransform: 'uppercase',
        maxLength: 16,
    };

    static getPickupDateFromInputConfig(pickupDateRange: boolean): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            isDropdown: true,
            label: pickupDateRange ? 'Start Date' : 'Date',
            placeholderIcon: 'date',
            isRequired: true,
            customClass: 'datetimeclass',
        };
    }

    static getPickupTimeFromInputConfig(
        selectedStopTimePickup: number
    ): ITaInput {
        return {
            name: 'timepicker',
            type: 'text',
            label: selectedStopTimePickup === 8 ? 'At' : 'From',
            placeholderIcon: 'time',
            isDropdown: true,
            isRequired: true,
            isFromDate: true,
            customClass: 'datetimeclass',
        };
    }

    static getPickupTimeToInputConfig(
        selectedStopTimePickup: number
    ): ITaInput {
        return {
            name: 'timepicker',
            type: 'text',
            label: 'To',
            placeholderIcon: 'time',
            isDropdown: true,
            isRequired: true,
            isDisabled:
                selectedStopTimePickup === 6 || selectedStopTimePickup === 2,
            customClass: 'datetimeclass',
        };
    }
    static getDeliveryDateFromInputConfig(
        deliveryDateRange: boolean
    ): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            isDropdown: true,
            label: deliveryDateRange ? 'Date From' : 'Date',
            placeholderIcon: 'date',
            isRequired: true,
            customClass: 'datetimeclass',
        };
    }

    static getDeliveryTimeFromInputConfig(
        selectedStopTimeDelivery: number
    ): ITaInput {
        return {
            name: 'timepicker',
            type: 'text',
            label: selectedStopTimeDelivery === 8 ? 'At' : 'From',
            placeholderIcon: 'time',
            isDropdown: true,
            isFromDate: true,
            isRequired: true,
            customClass: 'datetimeclass',
        };
    }

    static getDeliveryTimeToInputConfig(
        selectedStopTimeDelivery: number
    ): ITaInput {
        return {
            name: 'timepicker',
            type: 'text',
            label: 'To',
            placeholderIcon: 'time',
            isDropdown: true,
            isRequired: true,
            isDisabled:
                selectedStopTimeDelivery === 8 ||
                selectedStopTimeDelivery === 2,
            customClass: 'datetimeclass',
        };
    }

    static getExtraStopsDateFromInputConfig(label: boolean): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            isDropdown: true,
            label: label ? 'Date From' : 'Date',
            placeholderIcon: 'date',
            isRequired: true,
            customClass: 'datetimeclass',
        };
    }

    static getExtraStopsDateFromTimeFromInputConfig(label: string): ITaInput {
        return {
            name: 'timepicker',
            type: 'text',
            label: label?.toString()?.startsWith('9') ? 'At' : 'From',
            placeholderIcon: 'time',
            isFromDate: true,
            isDropdown: true,
            isRequired: true,
            customClass: 'datetimeclass',
        };
    }

    static getExtraStopsDateToTimeToInputConfig(
        label: string | number
    ): ITaInput {
        return {
            name: 'timepicker',
            type: 'text',
            label: 'To',
            placeholderIcon: 'time',
            isDropdown: true,
            isRequired: true,
            isDisabled: label?.toString()?.startsWith('9') || label === 2,
            customClass: 'datetimeclass',
        };
    }

    static DISPATCHER_INPUT: ICaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Dispatcher',
        isDropdown: true,
        isRequired: true,
        blackInput: false,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-230 load-dispatcher-wrapper',
    };

    static getDispatcherInputConfig(logoName: string, name: string): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Dispatcher',
            isDropdown: true,
            isRequired: true,
            dropdownImageInput: {
                withText: true,
                svg: false,
                image: true,
                url: logoName,
                nameInitialsInsteadUrl: !logoName ? name : null,
                template: 'user',
            },
            textTransform: 'capitalize',
            dropdownWidthClass: 'w-col-230 load-dispatcher-wrapper',
        };
    }

    static TRUCK_TYPE_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Truck Requirement',
        isRequired: true,
        isDropdown: true,
        dropdownImageInput: {
            withText: true,
            svg: true,
            image: false,
            iconsPath: '/assets/ca-components/svg/common/trucks/',
            activeItemIconKey: 'logoName',
        } as any,
        dropdownWidthClass: 'w-col-302',
        customClass: 'truck-trailer-dropdown',
    };

    static getTruckTypeIdInputConfig(
        selectedTruckReq: TruckTypeResponse
    ): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Truck Requirement',
            isDropdown: true,
            dropdownImageInput: {
                withText: true,
                svg: true,
                image: false,
                url: selectedTruckReq?.logoName,
                template: 'truck',
                class: selectedTruckReq?.name
                    ?.trim()
                    .replace(' ', '')
                    .toLowerCase(),
            },
            dropdownWidthClass: 'w-col-302',
            customClass: 'truck-trailer-dropdown',
        };
    }

    static TRAILER_TYPE_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Trailer Requirement',
        isRequired: true,
        isDropdown: true,
        dropdownImageInput: {
            withText: true,
            svg: true,
            image: false,
            iconsPath: '/assets/ca-components/svg/common/trucks/',
            activeItemIconKey: 'logoName',
        } as any,
        dropdownWidthClass: 'w-col-302',
        customClass: 'truck-trailer-dropdown',
    };

    static getTrailerInputConfig(
        selectedTrailerReq: TrailerTypeResponse,
        selectedTruckReq?: TruckTypeResponse
    ): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Trailer Requirement',
            isDropdown: true,
            isDisabled: selectedTruckReq?.id >= 3 && selectedTruckReq?.id <= 8,
            dropdownImageInput: {
                withText: true,
                svg: true,
                image: false,
                url: selectedTrailerReq?.logoName,
                template: 'trailer',
                class: ['Tanker', 'Tanker Pneumatic'].includes(
                    selectedTrailerReq?.name
                )
                    ? 'tanker'
                    : selectedTrailerReq?.name?.toLowerCase()?.includes('rgn')
                      ? 'low-boy-rgn'
                      : selectedTrailerReq?.name
                            ?.trim()
                            .replace(' ', '')
                            .toLowerCase(),
            },
            dropdownWidthClass: 'w-col-302',
            customClass: 'truck-trailer-dropdown',
        };
    }

    static getBillingValueInputConfig(additional: FormControl): ITaInput {
        return {
            name: 'price-separator',
            type: 'text',
            label: additional.get('name').value,
            labelInInput: true,
            priceSeparator: true,
            priceSeparatorLimitation: 6,
            placeholderIconRightSide:
                additional.get('id').value === 6
                    ? 'dollar'
                    : 'dollar-additional-load',
            placeholderIconColor:
                additional.get('id').value === 6 ? 'purple' : 'blue',
            inputCursorOnRightSide: true,
            removeInput: true,
            isRequired: true,
            hideErrorMessage: true,
            hideRequiredCheck: true,
            hideDangerMark: true,
            errorInsideInput: true,
        };
    }

    static getPaymentInputConfig(additional: FormControl): ITaInput {
        return {
            name: 'price-separator',
            type: 'text',
            label: additional.get('name').value,
            labelInInput: true,
            priceSeparator: true,
            priceSeparatorLimitation: 6,
            placeholderIconRightSide: 'dollar',
            placeholderIconColor:
                additional.get('name').value === 'Advance' ? 'green' : 'blue',
            inputCursorOnRightSide: true,
            removeInput: true,
            isRequired: true,
            hideErrorMessage: true,
            hideRequiredCheck: true,
            hideDangerMark: true,
            errorInsideInput: true,
        };
    }

    static STATUS_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Status',
        isDropdown: true,
        dropdownWidthClass: 'w-col-132 dropdown-status',
        statusStyle: true,
    };

    static DRIVE_RATE_INPUT_CONFIG: ITaInput = {
        name: 'price-separator',
        type: 'text',
        label: 'Driver Rate',
        labelInInput: true,
        isRequired: true,
        priceSeparator: true,
        priceSeparatorLimitation: 6,
        placeholderIconRightSide: 'dollar',
        placeholderIconColor: 'orange',
        inputCursorOnRightSide: true,
        hideErrorMessage: true,
        hideRequiredCheck: true,
    };

    static ADJUSTED_RATE_INPUT_CONFIG: ITaInput = {
        name: 'price-separator',
        type: 'text',
        label: 'Adjusted',
        labelInInput: true,
        isRequired: false,
        priceSeparator: true,
        priceSeparatorLimitation: 6,
        placeholderIconRightSide: 'dollar',
        placeholderIconColor: 'purple',
        inputCursorOnRightSide: true,
        hideErrorMessage: true,
        hideRequiredCheck: true,
    };

    static REVISED_RATE_INPUT_CONFIG: ITaInput = {
        name: 'price-separator',
        type: 'text',
        label: 'Revised',
        labelInInput: true,
        isRequired: true,
        priceSeparator: true,
        priceSeparatorLimitation: 6,
        placeholderIconRightSide: 'dollar',
        placeholderIconColor: 'gray',
        inputCursorOnRightSide: true,
        hideErrorMessage: true,
        hideRequiredCheck: true,
    };

    static TONU_RATE_INPUT_CONFIG: ITaInput = {
        name: 'price-separator',
        type: 'text',
        label: 'Tonu',
        labelInInput: true,
        isRequired: true,
        priceSeparator: true,
        priceSeparatorLimitation: 6,
        placeholderIconRightSide: 'dollar',
        placeholderIconColor: 'red',
        inputCursorOnRightSide: true,
        hideErrorMessage: true,
        hideRequiredCheck: true,
    };

    static getWaitTimeStartDateConfig(isDisabled: boolean): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            isDropdown: true,
            label: 'Start Date',
            labelInInput: true,
            isDisabled: isDisabled,
            isIconHidden: true,
        };
    }

    static getWaitTimeStartTimeConfig(isDisabled: boolean): ITaInput {
        return {
            name: 'timepicker',
            type: 'text',
            label: 'Start time',
            isFromDate: true,
            isDropdown: true,
            isRequired: true,
            labelInInput: true,
            isDisabled: isDisabled,
            isIconHidden: true,
        };
    }

    static getWaitTimeEndDateConfig(isDisabled: boolean): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            isDropdown: true,
            label: 'End Date',
            labelInInput: true,
            isDisabled: isDisabled,
            isIconHidden: true,
        };
    }

    static getWaitTimeEndTimeConfig(isDisabled: boolean): ITaInput {
        return {
            name: 'timepicker',
            type: 'text',
            label: 'End time',
            isFromDate: true,
            isDropdown: true,
            isRequired: true,
            labelInInput: true,
            isDisabled: isDisabled,
            isIconHidden: true,
        };
    }
}
