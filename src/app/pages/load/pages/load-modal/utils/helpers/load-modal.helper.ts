export class LoadModalHelper {
    static toNumber(value: string | number): number {
        if (typeof value === 'string') {
            const sanitizedValue = value.replace(/,/g, '');
            return Number(sanitizedValue);
        }
    
        return value;
    }
}