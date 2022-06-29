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
    .map((item: string, index: number) => {
      // Third check if value has '-'
      if (item.includes('-')) {
        const doubleValues: string[] = item.split('-');
        // Fourth check lentgh of doubleValues after splitting by -, must be 2
        if (doubleValues.length > 2) {
          arrayStops.pop();
          formControl.patchValue(value.substring(0, value.lastIndexOf(',')));
          return;
        }
        const foundSameElements: boolean = arrayStops.some((array1) =>
          doubleValues.includes(array1)
        );
        // Fifth check if values exist, denided, delete, return
        if (foundSameElements) {
          arrayStops.pop();
          formControl.patchValue(value.substring(0, value.lastIndexOf(',')));
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
            return parseInt(doubleValues[1]) - parseInt(doubleValues[0]);
          } else {
            arrayStops.pop();
            formControl.patchValue(value.substring(0, value.lastIndexOf(',')));
            return;
          }
        } else {
          arrayStops.pop();
          formControl.patchValue(value.substring(0, value.lastIndexOf(',')));
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
  return new Date(date).toISOString();
};

//------------------------------- DATE FROM BACKEND -------------------------------
export const convertDateFromBackend = (date: string) => {
  return moment(new Date(date)).format('YYYY-MM-DD');
};

//------------------------------- Convert thousand separator in number -------------------------------
export const convertThousanSepInNumber = (value: string) => {
  if (value) return parseFloat(value.toString().replace(/,/g, ''));
};
//------------------------------- Convert number in thousand separator -------------------------------
export const convertNumberInThousandSep = (value: number) => {
  if (value)
    return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};
