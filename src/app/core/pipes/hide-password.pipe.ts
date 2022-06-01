import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hidePassword',
})
export class HidePasswordPipe implements PipeTransform {
  transform(value: any, template: string, toogleVisibility: boolean): any {
    let hideNumber: string = '';
    switch (template) {
      case 'card': {
        for (let i = 0; i < value.length; i++) {
          if (i < 12) {
            hideNumber += '●';
          } else {
            hideNumber += value[i];
          }

          if ([3, 7, 11].includes(i)) {
            hideNumber += ' ';
          }
        }
        break;
      }
      case 'cvc': {
        for (let i = 0; i < value.length; i++) {
          hideNumber += '●';
        }
        break;
      }
      case 'account': {
        console.log(toogleVisibility)
        if(!toogleVisibility) {
          for (let i = 0; i < value.length; i++) {
            if (i < 3) {
              hideNumber += '●';
            } 
            else {
              hideNumber += value[i];
            }
          }
        }
        else {
          hideNumber = value;
        }
      }
      default: {
        break;
      }
    }

    return hideNumber;
  }
}
