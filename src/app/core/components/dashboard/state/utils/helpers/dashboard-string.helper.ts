export class DashboardStringHelper {
    static capitalizeFirstLetter(text: string) {
        const capitalizedText = text.charAt(0) + text.slice(1).toLowerCase();

        return capitalizedText;
    }
}
