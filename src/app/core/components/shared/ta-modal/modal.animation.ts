import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const modal_animation = (type: string) =>
  trigger(type, [
    state(
      'void',
      style({
        transform: 'scale(0.5)',
        opacity: 0,
      })
    ),
    state(
      '*',
      style({
        transform: 'scale(1)',
        opacity: 1,
      })
    ),

    transition('void <=> *', [animate('0.3s ease-in-out')]),
  ]);
