import {
    animate,
    state,
    style,
    transition,
    trigger,
    keyframes,
} from '@angular/animations';

export const inOutAnimation = (type: string) =>
    trigger(type, [
        state('in', style({ opacity: 1, scale: 1, height: '28px' })),
        transition(':enter', [
            animate(
                150,
                keyframes([
                    style({
                        opacity: 0,
                        offset: 0,
                        scale: 0.6,
                        height: '0px',
                    }),
                    style({
                        opacity: 0.25,
                        offset: 0.25,
                        scale: 0.7,
                        height: '10px',
                    }),
                    style({
                        opacity: 0.5,
                        offset: 0.5,
                        scale: 0.8,
                        height: '15px',
                    }),
                    style({
                        opacity: 0.75,
                        offset: 0.75,
                        scale: 0.9,
                        height: '20px',
                    }),
                    style({
                        opacity: 1,
                        offset: 1,
                        scale: 1,
                        height: '28px',
                    }),
                ])
            ),
        ]),
        transition(':leave', [
            animate(
                150,
                keyframes([
                    style({
                        opacity: 1,
                        offset: 0,
                        scale: 1,
                        height: '28px',
                    }),
                    style({
                        opacity: 1,
                        offset: 0.25,
                        scale: 0.9,
                        height: '20px',
                    }),
                    style({
                        opacity: 0.75,
                        offset: 0.5,
                        scale: 0.8,
                        height: '15px',
                    }),
                    style({
                        opacity: 0.25,
                        offset: 0.75,
                        scale: 0.7,
                        height: '10px',
                    }),
                    style({
                        opacity: 0,
                        offset: 1,
                        scale: 0.6,
                        height: '0px',
                    }),
                ])
            ),
        ]),
    ]);
