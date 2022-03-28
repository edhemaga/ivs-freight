import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const driver_details_animation = (type: string) =>
  trigger(type, [
    state(
      'true',
      style({
        height: '*',
        overflow: 'visible',
        opacity: '1',
        'margin-top': '6px',
      })
    ),
    state('false', style({ height: '0px', overflow: 'hidden', opacity: '0' })),
    transition('false <=> true', [animate('.3s ease-in-out')]),
  ]);
