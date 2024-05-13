import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const collapseAnimation = trigger('collapse', [
    state(
        'true',
        style({
            height: '*',
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
            opacity: '0',
            'margin-top': '0px',
            'margin-bottom': '0px',
        })
    ),
    transition('true <=> false', animate('.3s ease-in-out')),
]);
