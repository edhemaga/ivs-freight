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
        isRepairBillTable: boolean,
        isRepairOrderTable: boolean,
        isContactTable: boolean,
        isDepartmentContactTable: boolean,
        isPMTruckTable: boolean,
        isPMTrailerTable: boolean,
        isOffDutyLocationTable: boolean,
        isFuelCardTable: boolean,
        isPreviousAddressesTable: boolean,
        isFuelTransactionTable: boolean
    ): boolean {
        return this.setRequiredStar(
            headerItemIndex,
            isPhoneTable,
            isEmailTable,
            isRepairBillTable,
            isRepairOrderTable,
            isContactTable,
            isDepartmentContactTable,
            isPMTruckTable,
            isPMTrailerTable,
            isOffDutyLocationTable,
            isFuelCardTable,
            isPreviousAddressesTable,
            isFuelTransactionTable
        );
    }

    private setRequiredStar(
        i: number,
        isPhoneTable: boolean,
        isEmailTable: boolean,
        isRepairBillTable: boolean,
        isRepairOrderTable: boolean,
        isContactTable: boolean,
        isDepartmentContactTable: boolean,
        isPMTruckTable: boolean,
        isPMTrailerTable: boolean,
        isOffDutyLocationTable: boolean,
        isFuelCardTable: boolean,
        isPreviousAddressesTable: boolean,
        isFuelTransactionTable: boolean
    ): boolean {
        return (
            (i === 1 &&
                (isPhoneTable ||
                    isEmailTable ||
                    isFuelCardTable ||
                    isPreviousAddressesTable)) ||
            ((i === 1 || i === 3 || i === 4) &&
                (isRepairBillTable || isRepairOrderTable) &&
                !isFuelTransactionTable) ||
            ((i === 1 || i === 2 || i === 3 || i === 5) && isContactTable) ||
            ((i === 1 || i === 2 || i === 4) && isDepartmentContactTable) ||
            ((i === 2 || i === 3) && (isPMTruckTable || isPMTrailerTable)) ||
            ((i === 1 || i === 2) && isOffDutyLocationTable) ||
            ((i === 1 || i === 2 || i === 3) && isFuelTransactionTable)
        );
    }
}
