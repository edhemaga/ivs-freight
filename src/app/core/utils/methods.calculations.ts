import { AbstractControl } from '@angular/forms';
import moment from 'moment';

//------------------------------- Calculating Parking Slots -------------------------------
export const calculateParkingSlot = (
    value: string,
    formControl: AbstractControl
) => {
    // First check if value exist
    if (!value) {
        return 0;
    }
    let arrayStops: any[] = value.split(',');
    // Second check if arrayStops has ',' or ''
    if (arrayStops.includes(',') || arrayStops.includes('')) {
        arrayStops.pop();
        formControl.patchValue(value.substring(0, value.lastIndexOf(',')));
        return;
    }
    return arrayStops
        .map((item: string) => {
            // Third check if value has '-'
            if (item.includes('-')) {
                const doubleValues: string[] = item.split('-');
                // Fourth check lentgh of doubleValues after splitting by -, must be 2
                if (doubleValues.length > 2) {
                    arrayStops.pop();
                    formControl.patchValue(
                        value.substring(0, value.lastIndexOf(','))
                    );
                    return;
                }
                const foundSameElements: boolean = arrayStops.some((array1) =>
                    doubleValues.includes(array1)
                );
                // Fifth check if values exist, denided, delete, return
                if (foundSameElements) {
                    arrayStops.pop();
                    formControl.patchValue(
                        value.substring(0, value.lastIndexOf(','))
                    );
                    return;
                }
                // Sixth check if second value > first value
                if (!doubleValues.includes('')) {
                    if (parseInt(doubleValues[1]) > parseInt(doubleValues[0])) {
                        // Seventh check if value in range
                        arrayStops.forEach((item) => {
                            if (
                                parseInt(item) > parseInt(doubleValues[0]) &&
                                parseInt(item) < parseInt(doubleValues[1])
                            ) {
                                arrayStops.pop();
                                formControl.patchValue(
                                    value.substring(0, value.lastIndexOf(','))
                                );
                                return;
                            }
                        });
                        return (
                            parseInt(doubleValues[1]) -
                            parseInt(doubleValues[0])
                        );
                    } else {
                        arrayStops.pop();
                        formControl.patchValue(
                            value.substring(0, value.lastIndexOf(','))
                        );
                        return;
                    }
                } else {
                    arrayStops.pop();
                    formControl.patchValue(
                        value.substring(0, value.lastIndexOf(','))
                    );
                    return;
                }
            } else {
                // Eight chech has array duplicate items
                if (arrayStops.length !== new Set(arrayStops).size) {
                    arrayStops = [...new Set(arrayStops)];
                    formControl.patchValue(arrayStops.join(','));
                    return;
                } else {
                    return 1;
                }
            }
        })
        .reduce((accumulator, item) => {
            return (accumulator += item);
        }, 0);
};

//------------------------------- DATE TO BACKEND -------------------------------
export const convertDateToBackend = (date: string) => {
    return moment(new Date(date)).toISOString(true);
};

//------------------------------- DATE FROM BACKEND -------------------------------
export const convertDateFromBackend = (date: string) => {
    return moment.utc(date).local().format('MM/DD/YY');
};

//------------------------------- TIME FROM DATE FROM BACKEND -------------------------------
export const convertDateToTimeFromBackend = (
    date: string,
    show_am_ap?: boolean
) => {
    return moment
        .utc(date)
        .local()
        .format(show_am_ap ? 'HH:mm a' : 'HH:mm:SS');
};

//------------------------------- TIME FROM BACKEND -------------------------------
export const convertTimeFromBackend = (time: string) => {
    return moment(time, 'HH:mm:SS A').toDate();
};

//------------------------------- DATE FROM BACKEND TO TIME -------------------------------
export const convertDateFromBackendToTime = (date: string) => {
    return moment(new Date(date)).format('LT');
};

export const combineDateAndTimeToBackend = (date: string, time: string) => {
    if (!time) {
        return moment(new Date(date)).toISOString(true);
    }
    return moment(new Date(date + ' ' + time)).toISOString(true);
};
//------------------------------- DATE FROM BACKEND TO DATE AND TIME  -------------------------------
export const convertDateFromBackendToDateAndTime = (date: Date | string) => {
    return moment(new Date(date)).format('MM/DD/YY, hh:mm A');
};

//------------------------------- Convert thousand separator in number -------------------------------
export const convertThousanSepInNumber = (value: string) => {
    if (value) return parseFloat(value.toString().replace(/,/g, ''));
};
//------------------------------- Convert number in thousand separator -------------------------------
export const convertNumberInThousandSep = (value: number) => {
    if (value)
        // return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

//------------------------------- Convert number to short format (1.000 to 1K, 1.000.000 to 1M) -------------------------------
export const convertThousandToShortFormat = (value: number) => {
    if (value)
        return new Intl.NumberFormat(undefined, {
            //@ts-ignore
            notation: 'compact',
            compactDisplay: 'short',
        }).format(value);
};

//------------------------------- SPECIFIC PRICE CONVERTORS -------------------------------
export const convertNumberWithCurrencyFormatterToBackend = (
    value: number,
    hasDollar: boolean = false
) => {
    const formatedValue = value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });

    if (formatedValue.includes('$') && !hasDollar) {
        return formatedValue.slice(1);
    }

    return formatedValue;
};
