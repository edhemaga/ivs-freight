import { Pipe, PipeTransform } from '@angular/core';


const payrollNamesData = {
  "soloMiles": "Driver (Miles)",
  "soloFlatRate": "Driver (Flat Rate)",
  "soloCommission": "Driver (Commission)"
}


@Pipe({
  name: 'payrollTableNames'
})
export class PayrollTableNamesPipe implements PipeTransform {

  transform(title: string, expanded): string {
    if( title in payrollNamesData ){
      return payrollNamesData[title];
    }
    return "test";
  }
}