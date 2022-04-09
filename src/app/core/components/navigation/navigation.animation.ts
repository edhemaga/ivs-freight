import {
  animate,
  state,
  style,
  transition,
  trigger,
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
    state('false', style({ transform: 'translateX(-35px)', opacity: 0 })),
    transition('false <=> true', [animate('0.3s ease-in-out')]),
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
    state('false', style({ transform: 'translateX(-20px)', opacity: 0 })),
    transition('true => false', [animate('0s ease-in-out')]),
    transition('false => true', [animate('0.3s ease-in-out')]),
  ]);

export const navigation_magic_line = (type: string) =>
  trigger(type, [
    state(
      'true',
      style({
        width: '178px',
        overflow: 'visible',
        opacity: '1',
      })
    ),
    state('false', style({ width: '0px', overflow: 'hidden', opacity: '0' })),
    transition('false <=> true', [animate('0.3s ease-in-out')]),
  ]);
