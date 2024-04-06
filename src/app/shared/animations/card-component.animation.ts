import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const cardComponentAnimation = (
    type: string,
    mt: string = '0px',
    mb: string = '0px'
) =>
    trigger(type, [
        state(
            'true',
            style({
                height: '*',
                overflow: 'visible',
                opacity: '1',
                'margin-top': mt,
                'margin-bottom': mb,
            })
        ),
        state(
            'false',
            style({
                height: '0px',
                overflow: 'hidden',
                opacity: '0',
                'margin-top': '0px',
                'margin-bottom': '0px',
            })
        ),
        state(
            'null',
            style({
                height: '*',
            })
        ),
        transition('false <=> true', [animate('.3s ease-in-out')]),
        transition('true <=> false', [animate('.3s ease-in-out')]),
    ]);
