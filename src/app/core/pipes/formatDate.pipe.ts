import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'formatDateP',
})
export class formatDatePipe implements PipeTransform {
  transform(date: string,template?:string):any {
    switch(template){
      case 'short-format':{
        return moment(date).format('MM/YY')
      }
      default:{
        return moment(date).format('MM/DD/YY');
      }
    }

  }
}
