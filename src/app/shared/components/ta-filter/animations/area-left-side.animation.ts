import {
    animate,
    state,
    style,
    transition,
    trigger,
    keyframes,
} from '@angular/animations';

export const area_left_side_animation = (type: string) =>
    trigger(type, [
        state('in', style({ width: '100%', position: 'relative' })),
        transition(':enter', [
            animate(
                200,
                keyframes([
                    style({
                        width: '0%',
                        position: 'relative',
                        left: '0px',
                        //overflow: 'hidden',
                    }),
                    style({
                        width: '100%',
                        left: '0px',
                        //overflow: 'hidden'
                    }),
                ])
            ),
        ]),
        transition(':leave', [
            animate(
                200,
                keyframes([
                    style({
                        width: '100%',
                        left: '0px',
                        //overflow: 'hidden'
                    }),
                    style({
                        width: '0%',
                        left: '0px',
                        //overflow: 'hidden',
                    }),
                ])
            ),
        ]),
    ]);
