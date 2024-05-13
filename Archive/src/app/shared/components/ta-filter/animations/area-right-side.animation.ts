import {
    animate,
    state,
    style,
    transition,
    trigger,
    keyframes,
} from '@angular/animations';

export const areaRightSideAnimation = (type: string) =>
    trigger(type, [
        state('in', style({ width: '100%', position: 'relative' })),
        transition(':enter', [
            animate(
                200,
                keyframes([
                    style({
                        width: '0%',
                        right: '0px',
                        //overflow: 'hidden',
                    }),
                    style({
                        width: '100%',
                        right: '0px',
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
                        right: '0px',
                        //overflow: 'hidden'
                    }),
                    style({
                        width: '0%',
                        right: '0px',
                        //overflow: 'hidden',
                    }),
                ])
            ),
        ]),
    ]);
