import { Pipe, PipeTransform } from '@angular/core';
import { ByStateHeatMapColorsEnum } from '../enums';
import {
    DashboardColors,
} from '@pages/dashboard/utils/constants';

@Pipe({
    name: 'textColor',
    standalone: true,
})
export class TextColorPipe implements PipeTransform {
    transform(
        isSelected: boolean,
        selectedColor: string,
        isOrderNumber: boolean = false
    ): string {
        if (isSelected) {
            if (
                selectedColor === ByStateHeatMapColorsEnum.LIGHT_BLUE ||
                selectedColor === ByStateHeatMapColorsEnum.MEDIUM_LIGHT_BLUE
            ) {
                return ByStateHeatMapColorsEnum.DARK_BLUE;
            }
            return DashboardColors.COLOR_WHITE;
        } else {
            if (isOrderNumber) return DashboardColors.COLOR_GRAY;

            return DashboardColors.COLOR_BLACK;
        }
    }
}
