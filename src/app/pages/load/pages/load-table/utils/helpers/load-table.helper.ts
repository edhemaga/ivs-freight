export class LoadTableHelper {
    public static capitalizeFirstLetter(value: string): string {
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
    }
}