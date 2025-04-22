import { eCommonElement } from '@shared/enums';

export class TableViewHelper {
    static createTableViewConts(shouldAddMap?: boolean) {
        // Base array of table views
        const tableViews = [
            { name: eCommonElement.LIST },
            { name: eCommonElement.CARD },
        ];

        if (shouldAddMap) {
            tableViews.push({ name: eCommonElement.MAP });
        }

        return tableViews;
    }
}
