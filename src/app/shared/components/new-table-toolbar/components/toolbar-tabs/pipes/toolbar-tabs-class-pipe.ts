import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toolbarTabsClassPipe',
    standalone: true,
})
export class ToolbarTabsClassPipe implements PipeTransform {
    transform({
        isLargeLayout,
        isLargeAndActive,
        isLargeAndInActive,
        isSmallActive,
        isSmallAndInActive,
    }: {
        isLargeLayout: boolean;
        isLargeAndActive: boolean;
        isLargeAndInActive: boolean;
        isSmallActive: boolean;
        isSmallAndInActive: boolean;
    }): string {
        const classMap: { [key: string]: boolean } = {
            'new-table--toolbar-action text-size-16 p-8 d-flex align-items-center':
                isLargeLayout,
            'background-black text-color-white': isLargeAndActive,
            'text-color-bw6-2': isLargeAndInActive,
            'text-size-14 p-x-8 p-y-4': !isLargeLayout,
            'background-bw2 text-color-black': isSmallActive,
            'text-color-light-grey-2': isSmallAndInActive,
            'new-table--toolbar-action-inactive':
                isLargeAndInActive || isSmallAndInActive,
        };

        return Object.keys(classMap)
            .filter((className) => classMap[className])
            .join(' ');
    }
}
