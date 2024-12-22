import { Pipe, PipeTransform } from '@angular/core';

// enums
import { TableHeadTitleStringEnum } from '@shared/components/ta-table/ta-table-head/enums/table-head-title-string.enum';

@Pipe({ name: 'tableHeadRightBorder', standalone: true })
export class TableHeadRightBorderPipe implements PipeTransform {
    transform(tableHeadTitle: string, gridNameTitle: string): boolean {
        const repairTableCondition =
            gridNameTitle === TableHeadTitleStringEnum.REPAIR &&
            tableHeadTitle === TableHeadTitleStringEnum.COST;

        return repairTableCondition;
    }
}
