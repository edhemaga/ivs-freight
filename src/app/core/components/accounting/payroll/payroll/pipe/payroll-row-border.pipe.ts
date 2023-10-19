import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'payrollrowbordertablepipe',
})
export class PayrollRowBorderTablePipe implements PipeTransform {
    transform(value: any, data, index, type) {
        if( type == "border" ){
            if( !value.loadId && data[index -1]?.loadId ||  value?.loadId && !data[index -1]?.loadId){
                return true;
            }
        }
       
        return false;
    }
}