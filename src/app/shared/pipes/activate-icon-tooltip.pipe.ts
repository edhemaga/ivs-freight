import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { eStatusTab } from '@shared/enums';

@Pipe({
    name: 'activateIconTooltip',
    standalone: true,
})
export class ActivateIconTooltipPipe implements PipeTransform {
    transform(
        selectedTab: eStatusTab,
        count: number
    ): {
        tooltip: string;
        iconClass: Record<string, boolean>;
    } {
        const isActive = selectedTab === eStatusTab.ACTIVE;

        return {
            tooltip: isActive ? `Deactivate (${count})` : `Activate (${count})`,
            iconClass: {
                'background-hover-dark-2 svg-fill-muted svg-hover-black':
                    isActive,
                'background-hover-blue-16 svg-fill-blue-13 svg-hover-blue-15':
                    !isActive,
            },
        };
    }
}
