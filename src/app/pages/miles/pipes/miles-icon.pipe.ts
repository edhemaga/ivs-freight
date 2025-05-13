import { Pipe, PipeTransform } from '@angular/core';

// Config
import { MilesIconsConfig } from '@pages/miles/utils/configs';

@Pipe({
    name: 'milesIcon',
    standalone: true,
})
export class MilesIconPipe implements PipeTransform {
    transform(label: string): { icon: string; color: string } {
        return (
            MilesIconsConfig.IconConfig[label.toLowerCase()] || {
                icon: '',
                color: 'svg-fill-muted',
            }
        );
    }
}
