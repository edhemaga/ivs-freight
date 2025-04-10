import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tableColumnActionClass',
    standalone: true,
})
export class TableColumnActionClassPipe implements PipeTransform {
    transform({
        isHeadingHover,
        isGroup,
        isLastInGroup,
        isPinned,
        isPinAction,
        isSortActive,
        isSortAction,
    }: {
        isHeadingHover?: boolean;
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
            isHeadingHover ||
            (isPinned && (!isGroup || isLastInGroup)) ||
            (isHeadingHover && !isLastInGroup);

        return {
            'visible opacity-100': hasVisibleActions,
            'invisible opacity-0': !hasVisibleActions,
            'top-4': !isLastInGroup,
            'bottom-8': isLastInGroup,
        };
    }
}
