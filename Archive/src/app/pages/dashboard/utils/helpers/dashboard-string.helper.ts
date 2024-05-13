import { DashboardStringEnum } from '@pages/dashboard/enums/dashboard-string.enum';

export class DashboardStringHelper {
    static capitalizeFirstLetter(text: string) {
        let capitalizedText: string;

        if (
            text.includes(DashboardStringEnum.AM) ||
            text.includes(DashboardStringEnum.PM) ||
            text.includes(DashboardStringEnum.H_1) ||
            text.includes(DashboardStringEnum.H_2)
        ) {
            const subStringToLowerCase = text
                .substring(
                    1,
                    text.indexOf(DashboardStringEnum.EMPTY_SPACE_STRING)
                )
                .toLowerCase();

            capitalizedText =
                text.charAt(0) +
                subStringToLowerCase +
                text.slice(subStringToLowerCase.length + 1);
        } else {
            capitalizedText = text.charAt(0) + text.slice(1).toLowerCase();
        }

        return capitalizedText;
    }
}
