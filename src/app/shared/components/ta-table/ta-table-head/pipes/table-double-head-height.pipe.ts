import { Pipe, PipeTransform } from '@angular/core';

//enums
import { TableHeadTitleStringEnum } from '../enums/table-head-title-string.enum';

@Pipe({ name: 'tableDoubleHeadHeight', standalone: true })
export class TableDoubleHeadHeightPipe implements PipeTransform {
    transform(gridNameTitle: string): boolean {
        return (
            gridNameTitle === TableHeadTitleStringEnum.CONTACTS ||
            gridNameTitle === TableHeadTitleStringEnum.PM ||
            gridNameTitle === TableHeadTitleStringEnum.TRUCK ||
            gridNameTitle === TableHeadTitleStringEnum.REPAIR ||
            gridNameTitle === TableHeadTitleStringEnum.DRIVER ||
            gridNameTitle === TableHeadTitleStringEnum.CUSTOMER ||
            gridNameTitle === TableHeadTitleStringEnum.TRAILER ||
            gridNameTitle === TableHeadTitleStringEnum.LOAD ||
            gridNameTitle === TableHeadTitleStringEnum.USER
        );
    }
}
