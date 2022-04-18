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
        height: '*',
        overflow: 'visible',
        opacity: '1',
      })
    ),
    state('false', style({ height: '0px', overflow: 'hidden', opacity: '0' })),
    transition('false <=> true', [animate('0.3s ease-in-out')]),
  ]);
