import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taSvg',
})
export class TaSvgPipe implements PipeTransform {
  transform(svgPath: string, folder: string, subFolder?: string): any {
    if (!svgPath) {
      return null;
    }

    if (!svgPath.includes('.svg')) {
      svgPath = svgPath.concat('.svg');
    }

    if (!svgPath.includes('ic_')) {
      svgPath = 'ic_'.concat(svgPath);
    }
    if (!subFolder) {
      return `assets/svg/${folder}/${svgPath}`;
    }

    return `assets/svg/${folder}/${subFolder}/${svgPath}`;
  }
}
