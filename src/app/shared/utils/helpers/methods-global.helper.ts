import { DepartmentResponse } from 'appcoretruckassist';

export class MethodsGlobalHelper {
    static tableSearch(res: any, backFilterQuery: any): any {
        // On Typing
        if (!res.doReset && !res.isChipDelete && !res.chipAdded) {
            backFilterQuery[res.chip] = res.search;

            return {
                query: backFilterQuery,
                action: 'api',
            };
        }
        // On Reset If In Input Less Then 3 Char
        else if (res.doReset) {
            backFilterQuery[res.chip] = undefined;

            if (res.all) {
                return {
                    action: 'store',
                };
            } else {
                return {
                    query: backFilterQuery,
                    action: 'api',
                };
            }
        }
        // On Chip Add
        else if (res.chipAdded) {
            if (
                !backFilterQuery[res.query] ||
                backFilterQuery[res.query] !== res.search
            ) {
                backFilterQuery[res.query] = res.search;

                return {
                    query: backFilterQuery,
                    action: 'api',
                };
            }
        }
        // On Delete Chip
        else if (res.isChipDelete) {
            // If Other Chips Exist
            if (res.chips.length || res.search) {
                res.querys.map((query: any, i: number) => {
                    backFilterQuery[query] = res.chips[i]?.searchText
                        ? res.chips[i].searchText
                        : undefined;
                });

                // If In Input Char Exist, Add To Next Search Query
                if (res.search) {
                    backFilterQuery[res.addToQuery] = res.search;
                }

                return {
                    query: backFilterQuery,
                    action: 'api',
                };
            }
            // If No Other Exist
            else {
                return {
                    action: 'store',
                };
            }
        }
    }

    static closeAnimationAction(isDelete?: boolean, viewData?: any): any {
        if (!isDelete) {
            viewData = viewData.map((data: any) => {
                if (data?.actionAnimation) {
                    delete data.actionAnimation;
                }

                return data;
            });

            return viewData;
        } else {
            let newViewData = [];

            viewData.map((data: any) => {
                if (!data.hasOwnProperty('actionAnimation')) {
                    newViewData.push(data);
                }
            });

            viewData = newViewData;

            return viewData;
        }
    }

    static applyDrag(arr, dragResult) {
        const { removedIndex, addedIndex, payload } = dragResult;
        if (removedIndex === null && addedIndex === null) return arr;

        const result = [...arr];
        let itemToAdd = payload;

        if (removedIndex !== null) {
            itemToAdd = result.splice(removedIndex, 1)[0];
        }

        if (addedIndex !== null) {
            result.splice(addedIndex, 0, itemToAdd);
        }

        return result;
    }

    static removeDuplicateObjects(
        obj: DepartmentResponse[]
    ): DepartmentResponse[] {
        const uniqueObj = {};

        Object.values(obj).forEach((value) => {
            const key = JSON.stringify(value);

            uniqueObj[key] = value;
        });

        return Object.values(uniqueObj);
    }

    static checkIfEveryPropertyInObjectHasValue<T>(obj: { [key: string]: T }) {
        return Object.values(obj).every(
            (value) => value !== undefined && value !== null
        );
    }

    static checkIfEveryPropertyInObjectHasNoValue<T>(obj: {
        [key: string]: T;
    }) {
        return Object.values(obj).every((value) => !value);
    }

    static checkIfAnyItemInArrayHasNoValue<T>(array: T[]) {
        return array.some((element) => element === null);
    }

    static getBase64DataFromEvent(event: any): string | null {
        const base64String = event?.files[0]?.url;

        if (!base64String) {
            return null;
        }

        const parts = base64String.split(',');
        return parts[1] || null;
    }
}
