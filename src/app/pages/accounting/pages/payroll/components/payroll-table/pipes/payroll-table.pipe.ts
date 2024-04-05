import { CurrencyPipe, DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'payrolltablepipe',
})
export class PayrollTablePipe implements PipeTransform {
    constructor(
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe
    ) {}

    transform(data, field, index) {
        if (field.isIndexIncrement) {
            return index;
        }
        if (field.data_title) {
            return field.field;
        }

        if (field.data_field) {
            const deepObject = field.data_field.split('.');
            let returnValue = data;

            if (
                deepObject.length == 1 &&
                typeof returnValue[deepObject[0]] == 'undefined'
            ) {
                return '';
            }
            deepObject.map((item) => {
                if( item && returnValue){
                    if (item in returnValue) {
                        if( returnValue[item] )
                        returnValue = returnValue[item];
                        else returnValue = 0
                    }
                }
               
            });

            if (field.isDate) {
                returnValue = this.datePipe.transform(returnValue, 'MM/dd/YY');
            }

            if (field.isTime) {
                returnValue = this.datePipe.transform(returnValue, 'h:mm a');
            }

            if (field.isCurrency) {
                returnValue = this.currencyPipe.transform(returnValue, 'USD');
            }

            if(typeof returnValue == "number"){
                returnValue = returnValue.toFixed(2);
            }
            return returnValue;
        } else {
            return '';
        }
    }
}
