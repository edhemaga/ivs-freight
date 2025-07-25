import {
    animate,
    state,
    style,
    transition,
    trigger,
    query,
    sequence,
    stagger,
} from '@angular/animations';

export const navigationRouteAnimation = (type: string) =>
    trigger(type, [
        state(
            'true',
            style({
                transform: 'translateX(0px)',
                opacity: 1,
            })
        ),
        state('false', style({ transform: 'translateX(-20px)', opacity: 0 })),
        transition('true => false', [animate('0s ease-in-out')]),
        transition('false => true', [animate('0.3s ease-in-out')]),
    ]);

export const navigationMagicLine = (type: string) =>
    trigger(type, [
        state(
            'true',
            style({
                width: '238px',
                overflow: 'visible',
                opacity: '1',
            })
        ),
        state(
            'false',
            style({ width: '0px', overflow: 'hidden', opacity: '0' })
        ),
        transition('false <=> true', [animate('0.3s ease-in-out')]),
    ]);

export const dropDownAnimation = trigger('dropDownMenu', [
    transition(':enter', [
        style({ height: 0, overflow: 'hidden' }),
        query('.items', [style({ opacity: 0, transform: 'translateY(10px)' })]),
        sequence([
            animate('100ms', style({ height: '*' })),
            query('.items', [
                stagger(-10, [
                    animate(
                        '100ms ease',
                        style({ opacity: 1, transform: 'none' })
                    ),
                ]),
            ]),
        ]),
    ]),

    transition(':leave', [
        style({ height: '*', overflow: 'hidden' }),
        query('.items', [style({ opacity: 1, top: 'none' })]),
        sequence([
            query('.items', [
                stagger(0, [
                    animate(
                        '00ms ease',
                        style({ opacity: 0, top: 'translateY(10px)' })
                    ),
                ]),
            ]),
            animate('00ms', style({ height: 0 })),
        ]),
    ]),
]);

export const smoothHeight = (type: string) =>
    trigger(type, [
        state(
            'true',
            style({
                width: '238px',
                height: '812px',
                borderRadius: '3px',
            })
        ),
        state(
            'false',
            style({
                width: '120px',
                height: '34px',
                borderRadius: '34px',
            })
        ),
        transition('false <=> true', [animate('0.15s ease-in-out')]),
    ]);

export const test = (type: string) =>
    trigger(type, [
        state(
            'true',
            style({
                height: '347px',
            })
        ),
        state(
            'false',
            style({
                height: '0px',
            })
        ),
        transition('false <=> true', [animate('1s ease-in')]),
    ]);

export const moveElementsTopDownModal = (type: string) =>
    trigger(type, [
        state(
            'true',
            style({
                height: '28px',
                transform: 'translateX(0px)',
                opacity: 1,
            })
        ),
        state(
            'false',
            style({
                height: '14px',
                transform: 'translateX(-20px)',
                opacity: 0,
            })
        ),
        transition('false <=> true', [animate('0.3s ease-in-out')]),
    ]);
