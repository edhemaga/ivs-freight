import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const show_animation = (type: string) =>
    trigger(type, [
        state(
            'true',
            style({
                height: '*',
                overflow: 'visible',
                opacity: 1,
            })
        ),
        state(
            'false',
            style({
                height: '10px',
                overflow: 'hidden',
                opacity: '0.5',
            })
        ),
        state(
            'null',
            style({
                height: '10px',
                overflow: 'hidden',
                opacity: '0.5',
            })
        ),
        transition('false => true', [
            animate('150ms cubic-bezier(0, 0, 0.60, 1.99)'),
        ]),
        transition('true => false', [animate('150ms ease')]),
    ]);
