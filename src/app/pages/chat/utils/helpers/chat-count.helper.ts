export class ChatCount {
    static getTotalCount<T>(property: string, ...data: Array<T>): number {
        let totalCount = 0;
        data.forEach((item) => {
            if (!Array.isArray(item)) return;
            totalCount += item?.reduce((accumulator, currentObject) => {
                if (property in currentObject) {
                    return accumulator + (currentObject[property] ? 1 : 0);
                } else return accumulator;
            }, 0);
        });
        return totalCount;
    }
}
