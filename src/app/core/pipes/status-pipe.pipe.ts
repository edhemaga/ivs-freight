import { Pipe, PipeTransform } from '@angular/core';

const STATUS_COLORS = {
  1: 'C1C1C1',
  2: '508F91',
  3: '7FA2E6',
  4: '9F9F9F',
  5: 'E27579',
  6: 'FFC368',
  7: 'FFC368',
  8: 'FFC368',
  9: 'FFC368',
  10: 'EF82AE',
  11: '60D5BD',
  12: '74BF97',
  13: 'FB5555',
  14: 'FB5555',
};

@Pipe({
  name: 'statusPipe',
})
export class StatusPipePipe implements PipeTransform {
  transform(status_id: number, type: string): unknown {
    if (type === 'color') {
      // FOR NOW USE COLOR WITH #
      return `#${STATUS_COLORS[status_id]}`;
    }
  }
}
