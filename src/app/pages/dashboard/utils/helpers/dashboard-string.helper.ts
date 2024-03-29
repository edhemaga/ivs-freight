import { ConstantStringEnum } from '../../enums/constant-string.enum';

export class DashboardStringHelper {
    static capitalizeFirstLetter(text: string) {
        let capitalizedText: string;

        if (
            text.includes(ConstantStringEnum.AM) ||
            text.includes(ConstantStringEnum.PM) ||
            text.includes(ConstantStringEnum.H_1) ||
            text.includes(ConstantStringEnum.H_2)
        ) {
            const subStringToLowerCase = text
                .substring(
                    1,
                    text.indexOf(ConstantStringEnum.EMPTY_SPACE_STRING)
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
