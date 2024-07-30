import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'taSvg',
})
export class TaSvgPipe implements PipeTransform {
    transform(svgPath: string, folder: string, subFolder?: string): any {
        if (!svgPath) {
            return null;
        }

        if (svgPath.includes('assets/svg/dispatchboard/vacation.svg')) {
            return `assets/svg/dispatchboard/vacation.svg`;
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
