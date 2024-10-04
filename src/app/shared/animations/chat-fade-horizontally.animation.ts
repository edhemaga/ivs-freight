import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const chatFadeHorizontallyAnimation =
    trigger('fadeInOutHorizontal', [
        state('*', style(
            { 'overflow-x': 'hidden' }
        )),
        state('void', style(
            { 'overflow-x': 'hidden' }
        )),
        transition('* => void', [
            style(
                { width: '*' }
            ),
            animate(250, style(
                { width: 0 }
            ))
        ]),
        transition('void => *', [
            style(
                { width: '0' }
            ),
            animate(250, style(
                { width: '*' }
            ))
        ])
    ])
