// enums
import { TableStringEnum } from "@shared/enums";
import { eLoadStatusType } from "@pages/load/pages/load-table/enums";

export class LoadTableHelper {
    public static capitalizeFirstLetter(value: string): string {
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
    }

    public static composeDeleteModalTitle(selectedTab: string): string {
        let result = `Delete ${selectedTab}`;

        if (eLoadStatusType[selectedTab] !== eLoadStatusType.Template)
            result = result.concat(` ${TableStringEnum.LOAD_2}`);

        return result;
    }
}