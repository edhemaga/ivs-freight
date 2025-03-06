import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fuelItemQuantityType',
    standalone: true,
})
export class FuelItemQuantityTypePipe implements PipeTransform {
    transform(fuelItem: { name: string; quantity: number }): string {
        const { name, quantity } = fuelItem;

        const unitMap: Record<string, string> = {
            Diesel: ' gal.',
            DEF: ' gal.',
            Reefer: ' gal.',
            'Scale Ticket': ' pc.',
            Oil: ' pc.',
            Parking: quantity === 1 ? ' day' : ' days',
        };

        return quantity + (unitMap[name] || '');
    }
}
