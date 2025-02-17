import { Tabs } from "@shared/models";
import { Options } from '@angular-slider/ngx-slider';

export class TruckModalConstants {
    public static truckTypesWithLength: string[] = [
        'Box Truck',
        'Reefer Truck',
        'Dump Truck',
        'Cement Truck',
        'Garbage Truck',
        'Car Hauler',
    ];

    public static fuelTypeTrucks: string[] = [
        'Box Truck',
        'Cargo Van',
        'Reefer Truck',
    ];

    public static truckTypesWithAdditionalColumns: string[] = [
        'Dump Truck',
        'Cement Truck',
        'Garbage Truck',
    ];

    public static truckModalTabs: Tabs[] = [
        {
            id: 1,
            name: 'Basic',
            checked: true,
        },
        {
            id: 2,
            name: 'Additional',
        },
    ];

    public static commissionOptions: Options = {
        floor: 2,
        ceil: 25,
        step: 0.5,
        showSelectionBar: true,
        hideLimitLabels: true,
    };

}
