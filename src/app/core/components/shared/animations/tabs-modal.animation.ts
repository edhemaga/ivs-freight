import {
  animate,
  group,
  keyframes,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const left = [
  query(':enter, :leave', style({ position: 'absolute', width: '100%' }), {
    optional: true,
  }),
  group([
    query(
      ':enter',
      [
        style({
          transform: 'translateX(-30%)',
          opacity: 0,
          offset: 0,
          height: '0px'
        }),
        animate(
          '.2s ease-out',
          keyframes([
            style({
              transform: 'translateX(-15%)',
              opacity: 0.7,
              offset: 0.9,
              height: '*'
            }),
            style({
              transform: 'translateX(0%)',
              opacity: 1,
              offset: 1,
              height: '*'
            }),
          ])
        ),
      ],
      {
        optional: true,
      }
    ),
    query(
      ':leave',
      [
        style({
          transform: 'translateX(0%)',
          opacity: 0,
          height: '0px'
        }),
        animate(
          '.2s ease-out',
          style({
            transform: 'translateX(50%)',
            opacity: 0,
            height: '0px'
          })
        ),
      ],
      {
        optional: true,
      }
    ),
  ]),
];

const right = [
  query(':enter, :leave', style({ position: 'absolute', width: '100%' }), {
    optional: true,
  }),
  group([
    query(
      ':enter',
      [
        style({
          transform: 'translateX(50%)',
          opacity: 0,
          offset: 0,
          height: '0px'
        }),
        animate(
          '.2s ease-out',
          keyframes([
            style({
              transform: 'translateX(25%)',
              opacity: 0.7,
              offset: 0.9,
              height: '*'
            }),
            style({
              transform: 'translateX(0%)',
              opacity: 1,
              offset: 1,
              height: '*'
            }),
          ])
        ),
      ],
      {
        optional: true,
      }
    ),
    query(
      ':leave',
      [
        style({
          transform: 'translateX(0%)',
          opacity: 0,
          height: '0px'
        }),
        animate(
          '.2s ease-out',
          style({
            transform: 'translateX(-50%)',
            opacity: 0,
            height: '0px'
          })
        ),
      ],
      {
        optional: true,
      }
    ),
  ]),
];

export const tab_modal_animation = (type: string) =>
  trigger(type, [
    transition(':increment', right),
    transition(':decrement', left),
  ]);
