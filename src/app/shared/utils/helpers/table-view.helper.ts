import { TableStringEnum } from '@shared/enums';

export class TableViewHelper {
    static createTableViewConts(shouldAddMap?: boolean) {
        // Base array of table views
        const tableViews = [
            { name: TableStringEnum.LIST },
            { name: TableStringEnum.CARD },
        ];
        
        if (shouldAddMap) {
            tableViews.push({ name: TableStringEnum.MAP });
        }
    
        return tableViews;
    }
}
