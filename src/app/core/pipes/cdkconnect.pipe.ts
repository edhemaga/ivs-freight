import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cdkconnect',
})
export class CdkConnectPipe implements PipeTransform {
  constructor() {}

  transform(
    rowIndex: any,
    gridLength: number,
    gridIndex: number,
    type: string
  ) {
    if (type == 'driver') {
      if (rowIndex === gridLength) {
        return '';
      }
    }

    const data = [`${type}-1`];
    for (let i = 0; i < gridLength; i++) {
      const ni = parseInt(i + '' + gridIndex);
      if (i !== rowIndex) {
        data.push(type + ni);
      }
    }
    return data;
  }
}
