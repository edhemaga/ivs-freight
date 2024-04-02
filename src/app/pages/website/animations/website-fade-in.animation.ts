import { animate, style, transition, trigger } from '@angular/animations';

export const websiteFadeInAnimation = () =>
    trigger('fadeInAnimation', [
        transition(':enter', [
            style({ opacity: 0, visibility: 'hidden' }),
            animate(
                '0.8s ease-in-out',
                style({ opacity: 1, visibility: 'visible' })
            ),
        ]),
    ]);
