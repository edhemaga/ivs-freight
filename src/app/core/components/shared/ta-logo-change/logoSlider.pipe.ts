import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'logoSlider',
})
export class LogoSliderPipe implements PipeTransform {
    transform(customClass: any): any {
        return `custom-slider-logo-change ${customClass}`;
    }
}
