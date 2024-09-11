export class DispatchSortByPropertyHelper {
    static sortByProperty(arr, property, sort, sortDirection) {
        return arr.sort((a, b) => {
            const aValue = !sortDirection ? a['order'] : a[property]?.[sort];
            const bValue = !sortDirection ? b['order'] : b[property]?.[sort];

            if (aValue == null && bValue == null) {
                return 0;
            }
            if (aValue == null) {
                return 1;
            }
            if (bValue == null) {
                return -1;
            }

            let comparison = 0;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                comparison = aValue.localeCompare(bValue);
            } else {
                comparison = aValue - bValue;
            }

            return !sortDirection || sortDirection === 'asc'
                ? comparison
                : -comparison;
        });
    }
}
