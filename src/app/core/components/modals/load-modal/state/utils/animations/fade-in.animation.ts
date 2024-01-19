import { animate, style, transition, trigger } from '@angular/animations';

export const fadeInAnimation = trigger('fadeIn', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-500px)' }),
        animate(3000, style({ opacity: 1, transform: 'translateX(0px)' })),
    ]),
]);
