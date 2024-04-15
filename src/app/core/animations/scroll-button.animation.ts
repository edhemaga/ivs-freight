import { animate, style, transition, trigger } from '@angular/animations';

export const scrollButtonAnimation = (type: string) =>
    trigger(type, [
        transition(':enter', [
            style({ transform: 'scale(0.6)' }),
            animate('200ms', style({ transform: 'scale(0.8)' })),
        ]),
        transition(':leave', [
            style({ transform: 'scale(0.8)' }),
            animate('200ms', style({ transform: 'scale(0.6)' })),
        ]),
    ]);
