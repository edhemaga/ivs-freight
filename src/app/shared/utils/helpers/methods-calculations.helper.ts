import { AbstractControl } from '@angular/forms';

import moment from 'moment';

export class MethodsCalculationsHelper {
    //------------------------------- Calculating Parking Slots -------------------------------
    static calculateParkingSlot = (
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
                    const foundSameElements: boolean = arrayStops.some(
                        (array1) => doubleValues.includes(array1)
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
                        if (
                            parseInt(doubleValues[1]) >
                            parseInt(doubleValues[0])
                        ) {
                            // Seventh check if value in range
                            arrayStops.forEach((item) => {
                                if (
                                    parseInt(item) >
                                        parseInt(doubleValues[0]) &&
                                    parseInt(item) < parseInt(doubleValues[1])
                                ) {
                                    arrayStops.pop();
                                    formControl.patchValue(
                                        value.substring(
                                            0,
                                            value.lastIndexOf(',')
                                        )
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
    static convertDateToBackend = (date: string): string => {
        return moment(new Date(date)).toISOString(true);
    };

    //------------------------------- DATE FROM BACKEND -------------------------------
    static convertDateFromBackend = (date: string): string => {
        return moment.utc(date).local().format('MM/DD/YY');
    };

    //------------------------------- DATE FROM BACKEND TO FULL UTC  -------------------------------
    static convertDateFromBackendToFullUTC = (date: string): string => {
        return moment.utc(date).local().format();
    };

    //------------------------------- TIME FROM DATE FROM BACKEND -------------------------------
    static convertDateToTimeFromBackend = (
        date: string,
        show_am_ap?: boolean
    ): string => {
        if (!date) {
            return null;
        }
        return moment
            .utc(date)
            .local()
            .format(show_am_ap ? 'HH:mm A' : 'HH:mm:SS');
    };

    //------------------------------- TIME FROM BACKEND WITH EXTRA SECONDS / BAD TIME FORMAT - TO TIME -------------------------------
    static convertTimeFromBackendBadFormat = (time: string): string => {
        return moment(time.split('.')[0], 'HH:mm:ss').format('hh:mm A');
    };

    //------------------------------- TIME FROM BACKEND -------------------------------
    static convertTimeFromBackend = (time: string): Date => {
        return moment(time, 'HH:mm:SS A').toDate();
    };

    //------------------------------- DATE FROM BACKEND TO TIME -------------------------------
    static convertDateFromBackendToTime = (date: string): string => {
        return moment(new Date(date)).format('LT');
    };

    static combineDateAndTimeToBackend = (
        date: string,
        time: string
    ): string => {
        if (!time) {
            return moment(new Date(date)).toISOString(true);
        }
        return moment(new Date(date + ' ' + time)).toISOString(true);
    };

    //------------------------------- DATE FROM BACKEND TO DATE AND TIME  -------------------------------
    static convertDateFromBackendToDateAndTime = (
        date: Date | string
    ): string => {
        return moment(new Date(date)).format('MM/DD/YY, hh:mm A');
    };

    //------------------------------- CONVERT DATE TO TIME  -------------------------------
    static convertDateToTime = (date: Date | string): string => {
        return moment(new Date(date)).format('hh:mm A');
    };

    //------------------------------- Convert thousand separator in number -------------------------------
    static convertThousandSepInNumber = (value: string): number => {
        if (value) return parseFloat(value.toString().replace(/,/g, ''));
    };

    //------------------------------- Convert number in thousand separator -------------------------------
    static convertNumberInThousandSep = (value: number): string => {
        if (value)
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    //------------------------------- Convert number to short format (1.000 to 1K, 1.000.000 to 1M) -------------------------------
    static convertThousandToShortFormat = (value: number): string => {
        if (value)
            return new Intl.NumberFormat(undefined, {
                //@ts-ignore
                notation: 'compact',
                compactDisplay: 'short',
            }).format(value);
        else return '0';
    };

    // Convert regular date to ISO format
    static convertRegularDateToIsoFormat = (date: string): string | null => {
        const parsedDate = moment(date, 'MM/DD/YY', true);

        return parsedDate.isValid() ? parsedDate.format('YYYY-MM-DD') : null;
    };

    //------------------------------- SPECIFIC PRICE CONVERTORS -------------------------------
    static convertNumberWithCurrencyFormatterToBackend = (
        value: number,
        hasDollar: boolean = false
    ): string => {
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

    // Convert Miles to Meters
    static convertMilesToMeters = (miles: number): number => {
        return Math.round(miles * 1609.344);
    };

    // Convert Meters to Miles
    static convertMetersToMiles = (meters: number): number => {
        return Math.round(meters * 0.000621371192);
    };
}
