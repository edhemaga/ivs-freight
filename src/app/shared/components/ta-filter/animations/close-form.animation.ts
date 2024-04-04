import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const close_form = (type: string) =>
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
                height: '0px',
                'margin-top': '0px',
                opacity: 0,
            })
        ),
        state(
            'null',
            style({
                height: '*',
            })
        ),
        transition('false <=> true', [animate('0.1s linear')]),
        transition('true <=> false', [animate('0.1s ease-in-out')]),
    ]);
