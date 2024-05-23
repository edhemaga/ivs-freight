import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'setHeaderRequiredStar',
    standalone: true,
})
export class HeaderRequiredStarPipe implements PipeTransform {
    transform(
        headerItemIndex: number,
        isPhoneTable: boolean,
        isEmailTable: boolean,
        isDescriptionTable: boolean,
        isContactTable: boolean,
        isPMTruckTable: boolean,
        isPMTrailerTable: boolean,
        isOffDutyLocationTable: boolean,
        isFuelCardTable: boolean
    ): boolean {
        return this.setRequiredStar(
            headerItemIndex,
            isPhoneTable,
            isEmailTable,
            isDescriptionTable,
            isContactTable,
            isPMTruckTable,
            isPMTrailerTable,
            isOffDutyLocationTable,
            isFuelCardTable
        );
    }

    private setRequiredStar(
        i: number,
        isPhoneTable: boolean,
        isEmailTable: boolean,
        isDescriptionTable: boolean,
        isContactTable: boolean,
        isPMTruckTable: boolean,
        isPMTrailerTable: boolean,
        isOffDutyLocationTable: boolean,
        isFuelCardTable: boolean
    ): boolean {
        return (
            (i === 1 && (isPhoneTable || isEmailTable || isFuelCardTable)) ||
            ((i === 1 || i === 3 || i === 4) && isDescriptionTable) ||
            ((i === 1 || i === 2 || i === 3 || i === 5) && isContactTable) ||
            ((i === 2 || i === 3) && (isPMTruckTable || isPMTrailerTable)) ||
            ((i === 1 || i === 2) && isOffDutyLocationTable)
        );
    }
}
