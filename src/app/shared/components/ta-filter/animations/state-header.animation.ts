import {
    animate,
    state,
    style,
    transition,
    trigger,
    keyframes,
} from '@angular/animations';

export const state_header = (type: string) =>
    trigger(type, [
        state('in', style({ opacity: 1, height: '*' })),
        transition(':enter', [
            animate(
                150,
                keyframes([
                    style({ opacity: 0, offset: 0, height: '0px' }),
                    style({ opacity: 1, offset: 1, height: '*' }),
                ])
            ),
        ]),
        transition(':leave', [
            animate(
                150,
                keyframes([
                    style({ opacity: 1, offset: 0 }),
                    style({ opacity: 0, offset: 1, height: '0px' }),
                ])
            ),
        ]),
    ]);
