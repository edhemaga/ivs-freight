import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'input_placeholderIcon'
})
export class TaInputPlaceholderIconPipe implements PipeTransform {

  transform(iconPlaceholder: string): any {
    console.log("DD!@D10")
    if(!iconPlaceholder) {
      return null;
    }
    return `assets/svg/common/ic_${iconPlaceholder}.svg`;
  }

}
