import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoadTableStatusConstants {
    private statusFlow: {
        pending: {
            [key: string]: { previous: string | null; next: string[] };
        };
        active: {
            [key: string]: { previous: string | null; next: string[] };
        };
    } = {
        pending: {
            Booked: { previous: null, next: ['Assigned'] },
            Assigned: {
                previous: 'Booked',
                next: ['Dispatched', 'Unassigned', 'Cancelled'],
            },
            Dispatched: { previous: 'Assigned', next: ['Unassigned'] },
            Unassigned: { previous: 'Assigned', next: ['Cancelled'] },
            Cancelled: { previous: 'Unassigned', next: [] },
        },
        active: {
            Booked: { previous: null, next: ['Assigned'] },
            Assigned: {
                previous: 'Booked',
                next: ['Dispatched', 'Unassigned', 'Cancelled'],
            },
            Dispatched: { previous: 'Assigned', next: ['Unassigned'] },
            Unassigned: { previous: 'Dispatched', next: ['Cancelled'] },
            ArrivedPickup: {
                previous: 'Dispatched',
                next: ['Checked In Pickup', 'Loading'],
            },
            CheckedInPickup: { previous: 'Arrived Pickup', next: ['Loading'] },
            Loading: { previous: 'Checked In Pickup', next: ['Loaded'] },
            Loaded: { previous: 'Loading', next: ['Loaded'] },
            ArrivedDelivery: {
                previous: 'Loaded',
                next: ['Checked In Delivery', 'Offloading'],
            },
            CheckedInDelivery: {
                previous: 'Arrived Delivery',
                next: ['Offloading'],
            },
            Offloading: {
                previous: 'Checked In Delivery',
                next: ['Delivered'],
            },
        },
    };

    constructor() {}

    getStatusDetails(
        category: string,
        currentStatus: string
    ): {
        previous: string | null;
        next: string[];
    } {
        return (
            this.statusFlow[category][currentStatus] || {
                previous: null,
                next: [],
            }
        );
    }
}
