export class LoadDetailsCardHelper {
    static filterObjectProperties(obj) {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value) acc[key] = value;

            return acc;
        }, {});
    }

    static createRequirementProperties(property: string): string {
        switch (property) {
            case 'truckReq':
                return 'Truck Req.';
            case 'trailerReq':
                return 'Trailer Req.';
            case 'doorType':
                return 'Door Type';
            default:
                return property.charAt(0).toUpperCase() + property.slice(1);
        }
    }
}
