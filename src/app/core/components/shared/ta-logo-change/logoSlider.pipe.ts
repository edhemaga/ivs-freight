import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'logoSlider',
    standalone: true
})
export class LogoSliderPipe implements PipeTransform {
    transform(customClass: any): any {
        return `custom-slider-logo-change ${customClass}`;
    }
}
