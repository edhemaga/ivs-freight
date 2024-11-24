import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unitPosition',
  standalone: true
})
export class UnitPositionPipe implements PipeTransform {

  transform(value: string, indicator: string): string {
    switch (indicator) {
      case '$':
        return `${indicator}${value}`;
      case 'mi':
        return `${value} ${indicator}`;
      default:
        return `${value}`;
    }
  }
}
