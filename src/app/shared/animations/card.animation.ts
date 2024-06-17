import {
    trigger,
    state,
    style,
    transition,
    animate,
    keyframes,
} from '@angular/animations';

export const cardAnimation = (type: string) =>
    trigger(type, [
        state('in', style({ opacity: 1, 'max-height': '0px' })),
        transition(':enter', [
            animate(
                '5100ms',
                keyframes([
                    style({ opacity: 0, 'max-height': '0px' }),
                    style({ opacity: 1, 'max-height': '600px' }),
                ])
            ),
        ]),
        transition(':leave', [
            animate(
                '5100ms',
                keyframes([
                    style({ opacity: 1, 'max-height': '600px' }),
                    style({ opacity: 0, 'max-height': '0px' }),
                ])
            ),
        ]),
    ]);
