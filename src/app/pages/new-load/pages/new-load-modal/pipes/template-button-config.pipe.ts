import { Pipe, PipeTransform } from '@angular/core';
import { eLoadModalActions } from '@pages/new-load/enums';
import { eColor } from '@shared/enums';

export interface TemplateButtonConfigInput {
    isTemplateSelected: boolean;
    templateLength: number;
    isPopoverOpen: boolean;
}

@Pipe({
    name: 'templateButtonConfig',
    standalone: true,
})
export class TemplateButtonConfigPipe implements PipeTransform {
    transform(config: TemplateButtonConfigInput): {
        class: string;
        tooltip: string;
        tooltipBackground: string;
        tooltipColor: eColor;
    } {
        const { isTemplateSelected, templateLength, isPopoverOpen } = config;

        if (isPopoverOpen) {
            return {
                class: 'c-pointer background-black svg-fill-bw-9',
                tooltip: 'Close',
                tooltipBackground: eColor.LIGHT_GRAY_6,
                tooltipColor: eColor.BLACK_2,
            };
        }

        if (isTemplateSelected) {
            return {
                class: 'c-pointer background-blue-16 background-hover-red-15 svg-fill-blue-13 svg-hover-red-14',
                tooltip: 'Remove Template',
                tooltipBackground: eColor.BLACK,
                tooltipColor: eColor.WHITE,
            };
        }

        const baseClass =
            'background-light-grey-5 background-hover-bw-9 svg-muted svg-hover-black';

        return {
            class: templateLength > 0 ? `c-pointer ${baseClass}` : baseClass,
            tooltip: templateLength > 0 ? 'Select Template' : '',
            tooltipBackground: eColor.BLACK,
            tooltipColor: eColor.WHITE,
        };
    }
}
