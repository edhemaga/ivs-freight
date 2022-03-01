import { Navigation } from './navigation.model';

export const navigationData: Navigation[] = [
  {
    name: 'Dashboard',
    image: 'assets/img/svgs/navigation/ic_dashboard.svg',
    route: '/dashboard',
  },
  {
    name: 'Dispatch',
    image: 'assets/img/svgs/navigation/ic_dispatch.svg',
    route: '/dispatch',
  },
  {
    name: 'List',
    image: 'assets/img/svgs/navigation/ic_list.svg',
    arrow: 'assets/img/svgs/navigation/ic_arrow.svg',
    route: [
      {
        name: 'Load',
        route: '/load',
      },
      {
        name: 'Customer',
        route: '/customer',
      },
      {
        name: 'Driver',
        route: '/driver',
      },
      {
        name: 'Truck',
        route: '/truck',
      },
      {
        name: 'Trailer',
        route: '/trailer',
      },
      {
        name: 'Repair',
        route: '/repair',
      },
      {
        name: 'Fuel',
        route: '/fuel',
      },
      {
        name: 'Owner',
        route: '/owner',
      },
      {
        name: 'Account',
        route: '/account',
      },
      {
        name: 'Contact',
        route: '/contact',
      },
    ],
  },
  {
    name: 'Accounting',
    image: 'assets/img/svgs/navigation/ic_accounting.svg',
    arrow: 'assets/img/svgs/navigation/ic_arrow.svg',
    route: [
      {
        name: 'Payroll',
        route: '/payroll',
      },
      {
        name: 'IFTA',
        route: '/ifta',
      },
      {
        name: 'Ledger',
        route: '/ledger',
      },
      {
        name: 'Tax',
        route: '/tax',
      },
    ],
  },
  {
    name: 'Safety',
    image: 'assets/img/svgs/navigation/ic_safety.svg',
    arrow: 'assets/img/svgs/navigation/ic_arrow.svg',
    route: [
      {
        name: 'Violation',
        route: '/violation',
      },
      {
        name: 'Accident',
        route: '/accident',
      },
      {
        name: 'Log',
        route: '/log',
      },
      {
        name: 'Scheduled Ins.',
        route: '/scheduled',
      },
    ],
  },
  {
    name: 'Tools',
    image: 'assets/img/svgs/navigation/ic_tools.svg',
    arrow: 'assets/img/svgs/navigation/ic_arrow.svg',
    route: [
      {
        name: 'Miles',
        route: '/miles',
      },
      {
        name: 'MVR',
        route: '/mvr',
      },
      {
        name: 'Calendar',
        route: '/calendar',
      },
      {
        name: 'To-Do',
        route: '/todo',
      },
      {
        name: '1099',
        route: '/1099',
      },
      {
        name: '2290',
        route: '/2290',
      },
      {
        name: 'Factoring',
        route: '/factoring',
      },
      {
        name: 'Fax',
        route: '/fax',
      },
      {
        name: 'SMS',
        route: '/sms',
      },
    ],
  },
  {
    name: 'Routing',
    image: 'assets/img/svgs/navigation/ic_routing.svg',
    route: '/routing',
  },
  {
    name: 'Report',
    image: 'assets/img/svgs/navigation/ic_report.svg',
    route: '/report',
  },
  {
    name: 'Statistic',
    image: 'assets/img/svgs/navigation/ic_statistic.svg',
    route: '/statistic',
  },
  {
    name: 'Chat',
    image: 'assets/img/svgs/navigation/ic_chat.svg',
    route: '/chat',
  },
  {
    name: 'GPS',
    image: 'assets/img/svgs/navigation/ic_gps.svg',
    route: '/gps',
  },
  {
    name: 'Places',
    image: 'assets/img/svgs/navigation/ic_places.svg',
    route: '/places',
  },
  {
    name: 'File Manager',
    image: 'assets/img/svgs/navigation/ic_file_manager.svg',
    route: '/filemanager',
  },
];
