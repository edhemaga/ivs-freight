import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tableColumnActionClass',
    standalone: true,
})
export class TableColumnActionClassPipe implements PipeTransform {
    transform({
        isHeadingHover,
        isGroupHeadingHover,
        isGroup,
        isLastInGroup,
        isPinned,
        isPinAction,
        isSortActive,
        isSortAction,
    }: {
        isHeadingHover?: boolean;
        isGroupHeadingHover?: boolean;
        isGroup?: boolean;
        isLastInGroup?: boolean;
        isPinned?: boolean;
        isPinAction?: boolean;
        isSortActive?: boolean;
        isSortAction?: boolean;
    }): object | string {
        if (isPinAction)
            return isPinned
                ? 'svg-hover-blue-15 svg-fill-blue-13'
                : 'svg-fill-grey svg-hover-black';

        if (isSortAction) return isSortActive ? 'd-flex' : 'd-none';

        const hasVisibleActions =
            (isHeadingHover && !isGroupHeadingHover) ||
            (isPinned && (!isGroup || isLastInGroup)) ||
            (isGroupHeadingHover && isLastInGroup);

        return {
            'd-flex': hasVisibleActions,
            'hidden': !hasVisibleActions,
            'top-4': !isLastInGroup,
            'bottom-6': isLastInGroup,
        };
    }
}
