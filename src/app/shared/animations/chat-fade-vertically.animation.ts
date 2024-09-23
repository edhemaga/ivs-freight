import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const chatFadeVerticallyAnimation =
    trigger('fadeInOutVertical', [
        state('*', style(
            { 'overflow-y': 'hidden' }
        )),
        state('void', style(
            { 'overflow-y': 'hidden' }
        )),
        transition('* => void', [
            style(
                { height: '*' }
            ),
            animate(250, style(
                { height: 0 }
            ))
        ]),
        transition('void => *', [
            style(
                { height: '0' }
            ),
            animate(250, style(
                { height: '*' }
            ))
        ])
    ])
