import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const dropdown_animation_comment = (type: string) =>
    trigger(type, [
        state(
            'false',
            style({
                height: '14px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
            })
        ),
        state(
            'true',
            style({
                height: '*',
                overflow: 'visible',
                whiteSpace: 'normal',
            })
        ),
        transition('false <=> true', [animate('.3s ease-in-out')]),
        transition('true <=> false', [animate('.3s ease-in-out')]),
    ]);
