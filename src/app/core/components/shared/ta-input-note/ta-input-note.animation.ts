import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const input_note_animation = (type: string) =>
  trigger(type, [
    state(
      'true',
      style({
        height: "*"
      })
    ),
    state('false', style({ height: '0px' })),
    transition('false <=> true', [animate('0.3s ease-in-out')]),
  ]);
