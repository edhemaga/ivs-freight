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
                next: ['Dispatched', 'Unassigned', 'Canceled'],
            },
            Dispatched: { previous: 'Assigned', next: ['Unassigned'] },
            Unassigned: { previous: 'Assigned', next: ['Canceled'] },
            Canceled: { previous: 'Unassigned', next: [] },
        },
        active: {
            Booked: { previous: null, next: ['Assigned'] },
            Assigned: {
                previous: 'Booked',
                next: ['Dispatched', 'Unassigned', 'Canceled'],
            },
            Dispatched: { previous: 'Assigned', next: ['Unassigned'] },
            Unassigned: { previous: 'Dispatched', next: ['Canceled'] },
            Canceled: { previous: 'Unassigned', next: [] },
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
