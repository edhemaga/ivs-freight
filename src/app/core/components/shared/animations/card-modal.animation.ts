import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const card_modal_animation = (type: string) =>
    trigger(type, [
        state(
            'true',
            style({
                height: '*',
                overflow: 'visible',
                opacity: '1',
                'margin-top': '{{marginTop}}',
                'margin-bottom': '{{marginBottom}}',
            }),
            {
                params: {
                    marginTop: '{{marginTop}}',
                    marginBottom: '{{marginBottom}}',
                },
            }
        ),
        state(
            'false',
            style({
                height: '0px',
                overflow: 'hidden',
                opacity: '0',
                'margin-top': '0px',
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
