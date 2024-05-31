import { Pipe, PipeTransform } from '@angular/core';

//enum
import { TrailerNameStringEnum } from '@shared/enums/trailer-name-string.enum';

@Pipe({
    standalone: true,
    name: 'filterTrailerColorPipe',
})
export class FilterTrailerColorPipe implements PipeTransform {
    transform(trailer: string): string {
        if (trailer === TrailerNameStringEnum.DRY_VAN) {
            return trailer.replace(/\s+/g, '').toLowerCase();
        } else if (trailer === TrailerNameStringEnum.PNEUMATIC_TANKER) {
            return trailer.replace(/\s+/g, '').toLowerCase();
        } else if (trailer === TrailerNameStringEnum.CAR_HAULER) {
            return trailer.replace(/\s+/g, '').toLowerCase();
        } else if (trailer === TrailerNameStringEnum.CAR_HAULER_STINGER) {
            return trailer.replace(/\s+/g, '').toLowerCase();
        } else if (trailer === TrailerNameStringEnum.LOW_BOY_RGN) {
            return trailer.replace(/[\s\/]+/g, '').toLowerCase();
        } else if (trailer === TrailerNameStringEnum.STEP_DECK) {
            return trailer.replace(/\s+/g, '').toLowerCase();
        } else if (trailer === TrailerNameStringEnum.FLAT_BED) {
            return trailer.replace(/\s+/g, '').toLowerCase();
        } else if (trailer === TrailerNameStringEnum.SIDE_KIT) {
            return trailer.replace(/\s+/g, '').toLowerCase();
        } else {
            return trailer.toLowerCase();
        }
    }
}
