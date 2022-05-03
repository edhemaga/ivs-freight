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
        overflow: 'visible',
        opacity: '1',
        height: "*"
      })
    ),
    state('false', style({ overflow: 'hidden', opacity: '0', height: "0px" })),
    transition('false <=> true', [animate('0.3s ease-in-out')]),
  ]);
