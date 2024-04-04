import {
    animate,
    state,
    style,
    transition,
    trigger,
    keyframes,
} from '@angular/animations';

export const close_form = (type: string) =>
    trigger(type, [
        state(
            'true',
            style({
                height: '*',
                opacity: 1,
            })
        ),
        state(
            'false',
            style({
                height: '0px',
                'margin-top': '0px',
                opacity: 0,
            })
        ),
        state(
            'null',
            style({
                height: '*',
            })
        ),
        transition('false <=> true', [animate('0.1s linear')]),
        transition('true <=> false', [animate('0.1s ease-in-out')]),
    ]);

export const in_out_animation = (type: string) =>
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

export const state_header = (type: string) =>
    trigger(type, [
        state('in', style({ opacity: 1, height: '*' })),
        transition(':enter', [
            animate(
                150,
                keyframes([
                    style({ opacity: 0, offset: 0, height: '0px' }),
                    style({ opacity: 1, offset: 1, height: '*' }),
                ])
            ),
        ]),
        transition(':leave', [
            animate(
                150,
                keyframes([
                    style({ opacity: 1, offset: 0 }),
                    style({ opacity: 0, offset: 1, height: '0px' }),
                ])
            ),
        ]),
    ]);

export const show_animation = (type: string) =>
    trigger(type, [
        state(
            'true',
            style({
                height: '*',
                overflow: 'visible',
                opacity: 1,
            })
        ),
        state(
            'false',
            style({
                height: '10px',
                overflow: 'hidden',
                opacity: '0.5',
            })
        ),
        state(
            'null',
            style({
                height: '10px',
                overflow: 'hidden',
                opacity: '0.5',
            })
        ),
        transition('false => true', [
            animate('150ms cubic-bezier(0, 0, 0.60, 1.99)'),
        ]),
        transition('true => false', [animate('150ms ease')]),
    ]);

export const area_right_side_animation = (type: string) =>
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
