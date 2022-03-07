import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'nFormatter',
  pure: true,
})
export class NFormatterPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): string {
    return this.nFormatter(value, 2);
  }

  public nFormatter(num, digits) {
    const si = [
      {value: 1, symbol: ''},
      {value: 1e3, symbol: 'K'},
      {value: 1e6, symbol: 'M'},
      {value: 1e9, symbol: 'G'},
      {value: 1e12, symbol: 'T'},
      {value: 1e15, symbol: 'P'},
      {value: 1e18, symbol: 'E'},
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }

    let total = (num / si[i].value).toFixed(digits).replace(rx, '$1');
    if (si[i].symbol) {
      return '$' + total + si[i].symbol;
    } else {
      if (total.includes('.')) {
        const prefix = total.split('.')[0];
        const sufix = total.split('.')[1];
        total =
          '<span>$' +
          prefix +
          '</span>' +
          `<span class='total-sufix'>.` +
          sufix +
          '</span>';
      } else {
        total = '$' + total + `<span class='total-sufix'>.00</span>`;
      }

      return total;
    }
  }
}
