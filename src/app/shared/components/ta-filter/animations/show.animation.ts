import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const showAnimation = (type: string) =>
    trigger(type, [
        state(
            'true',
            style({
                height: '*',
                opacity: 1,
            })
        ),
        state(
            'false',
            style({
                height: '10px',
                opacity: '0.5',
            })
        ),
        state(
            'null',
            style({
                height: '10px',
                opacity: '0.5',
            })
        ),
        transition('false => true', [
            animate('150ms cubic-bezier(0, 0, 0.60, 1.99)'),
        ]),
        transition('true => false', [animate('150ms ease')]),
    ]);
