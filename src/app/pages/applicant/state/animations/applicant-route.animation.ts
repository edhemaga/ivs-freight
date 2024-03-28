import { style, query, animate, group } from '@angular/animations';

export const slideLeft = [
    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), {
        optional: true,
    }),
    group([
        query(
            ':enter',
            [
                style({ transform: 'translateX(-100%)', opacity: 0 }),
                animate('.2s linear', style({ opacity: 1 })),
                animate('.3s linear', style({ transform: 'translateX(0%)' })),
            ],
            {
                optional: true,
            }
        ),
        query(
            ':leave',
            [
                style({ transform: 'translateX(0%)', opacity: 1 }),
                animate('.2s linear', style({ opacity: 0 })),
                animate('.3s linear', style({ transform: 'translateX(100%)' })),
            ],
            {
                optional: true,
            }
        ),
    ]),
];

export const slideRight = [
    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), {
        optional: true,
    }),
    group([
        query(
            ':enter',
            [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('.2s linear', style({ opacity: 1 })),
                animate('.3s linear', style({ transform: 'translateX(0%)' })),
            ],
            {
                optional: true,
            }
        ),
        query(
            ':leave',
            [
                style({ transform: 'translateX(0%)', opacity: 1 }),
                animate('.2s linear', style({ opacity: 0 })),
                animate(
                    '.3s linear',
                    style({ transform: 'translateX(-100%)' })
                ),
            ],
            {
                optional: true,
            }
        ),
    ]),
];
