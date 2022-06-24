import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'formatCurrency',
})
export class formatCurrency implements PipeTransform {
  transform(currency: any) {
    return '$' + currency.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }
}
