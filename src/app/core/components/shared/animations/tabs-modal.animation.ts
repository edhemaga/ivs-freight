import {
    animate,
    group,
    keyframes,
    query,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const left = [
    query(':leave', style({ position: 'absolute', width: '100%' }), {
        optional: true,
    }),
    group([
        query(
            ':enter',
            [
                style({
                    transform: 'translateX(-80%)',
                    opacity: 0,
                    height: '{{height}}',
                }),
                animate(
                    '.2s',
                    keyframes([
                        style({
                            transform: 'translateX(0%)',
                            opacity: 1,
                            height: '*',
                        }),
                    ])
                ),
            ],
            {
                optional: true,
            }
        ),
        query(
            ':leave',
            [
                style({
                    transform: 'translateX(0%)',
                    opacity: 0,
                }),
                animate(
                    '.2s',
                    style({
                        transform: 'translateX(80%)',
                        opacity: 0,
                        height: '*',
                    })
                ),
            ],
            {
                optional: true,
            }
        ),
    ]),
];

const right = [
    query(':leave', style({ position: 'absolute', width: '100%' }), {
        optional: true,
    }),
    group([
        query(
            ':enter',
            [
                style({
                    transform: 'translateX(80%)',
                    opacity: 0,
                    height: '{{height}}',
                }),
                animate(
                    '.2s',
                    keyframes([
                        style({
                            transform: 'translateX(0%)',
                            opacity: 1,
                            height: '*',
                        }),
                    ])
                ),
            ],
            {
                optional: true,
            }
        ),
        query(
            ':leave',
            [
                style({
                    transform: 'translateX(0%)',
                    opacity: 0,
                }),
                animate(
                    '.2s',
                    style({
                        transform: 'translateX(-80%)',
                        opacity: 0,
                        height: '*',
                    })
                ),
            ],
            {
                optional: true,
            }
        ),
    ]),
];

export const tab_modal_animation = (type: string) =>
    trigger(type, [
        transition(':increment', right, { params: { height: '{{height}}' } }),
        transition(':decrement', left, { params: { height: '{{height}}' } }),
    ]);
