import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'payrolltablepipe',
})
export class PayrollTablePipe implements PipeTransform {
    constructor() {}

    transform(data, field) {
        if (field.data_field) {
            const deepObject = field.data_field.split('.');
            let returnValue = data;
            deepObject.map((item) => {
                if (item in returnValue) {
                    returnValue = returnValue[item];
                }
            });
            console.log(returnValue);
            return returnValue;
        } else {
            return '';
        }
    }
}
