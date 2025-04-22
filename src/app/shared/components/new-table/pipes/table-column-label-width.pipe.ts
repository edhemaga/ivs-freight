import { Pipe, PipeTransform } from '@angular/core';

// enums
import { eUnit } from 'ca-components';

@Pipe({
    name: 'tableColumnLabelWidth',
    standalone: true,
})
export class TableColumnLabelWidthPipe implements PipeTransform {
    transform({
        columnWidth,
        isTableLocked,
        isPinned,
        isHeadingHover,
        isGroup,
        isLastInGroup,
    }: {
        columnWidth: number;
        isTableLocked: boolean;
        isPinned: boolean;
        isHeadingHover: boolean;
        isGroup: boolean;
        isLastInGroup: boolean;
    }): object {
        const extraWidth = isPinned || (isGroup && !isLastInGroup) ? 25 : 50;

        return {
            'max-width':
                isTableLocked || !isHeadingHover
                    ? '100%'
                    : `calc(${columnWidth}${eUnit.PX} - ${extraWidth}${eUnit.PX})`,
        };
    }
}
