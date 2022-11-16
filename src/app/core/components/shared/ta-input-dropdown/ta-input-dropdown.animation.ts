import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const input_dropdown_animation = (type: string) =>
  trigger(type, [
    state(
      'true',
      style({
        height: '*',
        overflow: 'hidden',
        opacity: '1',
      })
    ),
    state('false', style({ height: '0px', overflow: 'hidden', opacity: '0' })),
    transition('false <=> true', [animate('0.15s ease-in-out')]),
  ]);
