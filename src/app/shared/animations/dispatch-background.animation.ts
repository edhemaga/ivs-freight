import { animate, style, transition, trigger } from '@angular/animations';

export const dispatchBackgroundAnimation = () =>
    trigger('dispatchBackgroundAnimation', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('100ms', style({ opacity: '*' })),
        ]),
        transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
    ]);
