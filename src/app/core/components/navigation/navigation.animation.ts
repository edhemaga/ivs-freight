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

export const navigation_route_animation = (type: string) =>
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

export const navigation_header_animation = (type: string) =>
    trigger(type, [
        state(
            'true',
            style({
                transform: 'translateX(0px)',
                opacity: 1,
            })
        ),
        state('true', style({ transform: 'translateX(-20px)', opacity: 0 })),
        // transition('true => false', [animate('0s ease-in-out')]),
        transition('false <=> true', [animate('0.3s ease-in-out')]),
    ]);

export const navigation_magic_line = (type: string) =>
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

export const DropDownAnimation = trigger('dropDownMenu', [
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
