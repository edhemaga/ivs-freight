import {animate, keyframes, query, sequence, stagger, state, style, transition, trigger} from '@angular/animations';

// animation for chips
export let enterLeave = trigger('enterLeave', [
  state('flyIn', style({transform: 'translateX(0) scale(1)', opacity: 1})),
  transition(':enter', [
    style({transform: 'translateX(-70%) scale(1)', opacity: 0}),
    animate('100ms ease-in')
  ]),
  transition(':leave', [animate('0.3s ease-out', style({transform: 'scale(0.5)', opacity: 0}))])
]);

// aniamtion for table rows
export let listAnimation = trigger('listAnimation', [
  transition('* => *', [
    query('tbody tr', style({opacity: 0}), {optional: true}),
    query('tbody tr.k-grid-norecords', style({display: 'none'}), {optional: true}),
    query(
      'tbody tr:not(.k-grid-norecords)',
      stagger('10ms', [
        animate(
          '1s ease-in',
          keyframes([
            style({'z-index': -1, opacity: 0, transform: 'translateY(-10px)', offset: 0}),
            // style({ opacity: 0.5, transform: 'translateY(10px)', offset: 0.3 }),
            style({opacity: 1, transform: 'translateY(0)', offset: 1.0})
          ])
        )
      ]),
      {optional: true}
    )
  ])
]);

export let anim = trigger('anim', [
  transition('* => *', [
    query(
      'tbody tr',
      style({
        height: '*',
        opacity: '1',
        transform: 'translateX(0)',
        'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)'
      }),
      {optional: true}
    ),
    query('tbody tr.k-grid-norecords', style({display: 'none'}), {optional: true}),
    query(
      'tbody tr:not(.k-grid-norecords)',
      sequence([
        animate(
          '1s ease',
          style({height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none'})
        ),
        animate(
          '1s ease',
          style({height: '0', opacity: 0, transform: 'translateX(20px)', 'box-shadow': 'none'})
        )
      ]),
      {optional: true}
    )
  ])
]);

export let filterAnimation = trigger('filterAnimation', [
  transition(':enter, * => 0, * => -1', []),
  transition(':increment', [
    query(
      ':enter',
      [
        style({opacity: 0, width: '0px'}),
        stagger(50, [animate('300ms ease-out', style({opacity: 1, width: '*'}))])
      ],
      {optional: true}
    )
  ]),
  transition(':decrement', [
    query(':leave', [
      stagger(50, [animate('300ms ease-out', style({opacity: 0, width: '0px'}))])
    ])
  ])
]);

export let todoExpandAnimation = trigger('todoExpandAnimation', [
  transition(':enter', [
    style({height: 0, opacity: 0}),
    animate('0.3s ease-out', style({height: '*', opacity: 1}))
  ]),
  transition(':leave', [
    style({height: '*', opacity: 1}),
    animate('0.3s ease-in', style({height: 0, opacity: 0}))
  ])
]);

export let tabSwitchModalIn = trigger('tabSwitchModalIn', [
  transition(':enter', [
    style({transform: 'translateX(-110%)'}),
    animate('250ms linear', style({transform: 'translateX(0%)'}))
  ]),
  transition(':leave', [animate('250ms linear', style({transform: 'translateX(-110%)'}))])
]);

export let tabSwitchModalOut = trigger('tabSwitchModalOut', [
  transition(':enter', [
    style({transform: 'translateX(110%)'}),
    animate('250ms linear', style({transform: 'translateX(0%)'}))
  ]),
  transition(':leave', [animate('250ms linear', style({transform: 'translateX(110%)'}))])
]);
