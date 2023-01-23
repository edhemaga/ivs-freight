import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'payrolltablepipe',
})
export class PayrollTablePipe implements PipeTransform {
    constructor() {}

    transform(data, field, index) {
        if (field.isIndexIncrement) {
            return index + 1;
        }
        if (field.data_field) {
            const deepObject = field.data_field.split('.');
            let returnValue = data;

            if (deepObject.length == 1 && !returnValue[deepObject[0]]) {
                return '';
            }
            deepObject.map((item) => {
                if (item in returnValue) {
                    returnValue = returnValue[item];
                }
            });

            return returnValue;
        } else {
            return '';
        }
    }
}
