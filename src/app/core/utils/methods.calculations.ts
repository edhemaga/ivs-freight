import { AbstractControl } from '@angular/forms';

export const calculateParkingSlot = (
  value: string,
  formControl: AbstractControl
) => {
  // First check if value exist
  if (!value) {
    return 0;
  }
  let arrayStops: any[] = value.split(',');
  console.log('ITEMS AFTER SPLITTING BY , = ', arrayStops);
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
        console.log('Double values after splitting by - = ', doubleValues);
        const foundSameElements: boolean = arrayStops.some((array1) =>
          doubleValues.includes(array1)
        );
        console.log('Has duplicate values =  ', foundSameElements);
        // Fifth check if values exist, denided, delete, return
        if (foundSameElements) {
          arrayStops.pop();
          formControl.patchValue(value.substring(0, value.lastIndexOf(',')));
          console.log('Found duplicate values');
          console.log(arrayStops);
          console.log(formControl.value);
          return;
        }
        console.log('No found dobule items ', doubleValues);
        // Sixth check if second value > first value
        if (!doubleValues.includes('')) {
          console.log('No empty values = ', doubleValues[0], doubleValues[1]);
          if (parseInt(doubleValues[1]) > parseInt(doubleValues[0])) {
            console.log(
              'Second grather than first = ',
              doubleValues[0],
              doubleValues[1]
            );
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
            console.log('First grather than second');
            console.log(arrayStops);
            console.log(formControl.value);
            return;
          }
        } else {
          arrayStops.pop();
          formControl.patchValue(value.substring(0, value.lastIndexOf(',')));
          console.log('One of two values has been empty');
          console.log(arrayStops);
          console.log(formControl.value);
          return;
        }
      } else {
        console.log('NEMA  - ');
        // Eight chech has array duplicate items
        if (arrayStops.length !== new Set(arrayStops).size) {
          console.log('HAS DUPLICATE ITEMS');
          arrayStops = [...new Set(arrayStops)];
          formControl.patchValue(arrayStops.join(','));
          console.log('After Delete duplicate values ', arrayStops);
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
