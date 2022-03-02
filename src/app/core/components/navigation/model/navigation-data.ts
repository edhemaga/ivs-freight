import { Navigation, NavigationModal } from './navigation.model';

export const navigationData: Navigation[] = [
  {
    id: 1,
    name: 'Dashboard',
    image: 'assets/img/svgs/navigation/ic_dashboard.svg',
    route: '/dashboard',
  },
  {
    id: 2,
    name: 'Dispatch',
    image: 'assets/img/svgs/navigation/ic_dispatch.svg',
    route: '/dispatch',
  },
  {
    id: 3,
    name: 'List',
    image: 'assets/img/svgs/navigation/ic_list.svg',
    arrow: 'assets/img/svgs/navigation/ic_arrow.svg',
    isSubRouteActive: false,
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
    id: 4,
    name: 'Accounting',
    image: 'assets/img/svgs/navigation/ic_accounting.svg',
    arrow: 'assets/img/svgs/navigation/ic_arrow.svg',
    isSubRouteActive: false,
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
    id: 5,
    name: 'Safety',
    image: 'assets/img/svgs/navigation/ic_safety.svg',
    arrow: 'assets/img/svgs/navigation/ic_arrow.svg',
    isSubRouteActive: false,
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
    id: 6,
    name: 'Tools',
    image: 'assets/img/svgs/navigation/ic_tools.svg',
    arrow: 'assets/img/svgs/navigation/ic_arrow.svg',
    isSubRouteActive: false,
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
    id: 7,
    name: 'Routing',
    image: 'assets/img/svgs/navigation/ic_routing.svg',
    route: '/routing',
  },
  {
    id: 8,
    name: 'Report',
    image: 'assets/img/svgs/navigation/ic_report.svg',
    route: '/report',
  },
  {
    id: 9,
    name: 'Statistic',
    image: 'assets/img/svgs/navigation/ic_statistic.svg',
    route: '/statistic',
  },
  {
    id: 10,
    name: 'Chat',
    image: 'assets/img/svgs/navigation/ic_chat.svg',
    route: '/chat',
  },
  {
    id: 11,
    name: 'GPS',
    image: 'assets/img/svgs/navigation/ic_gps.svg',
    route: '/gps',
  },
  {
    id: 12,
    name: 'Places',
    image: 'assets/img/svgs/navigation/ic_places.svg',
    route: '/places',
  },
  {
    id: 13,
    name: 'File Manager',
    image: 'assets/img/svgs/navigation/ic_file_manager.svg',
    route: '/filemanager',
  },
];

// General Navigation Data

export const generalNavigationData: NavigationModal[] = [
  {
    name: 'Load',
    path: 'load',
  },
  {
    name: 'Driver',
    path: 'driver',
  },
  {
    name: 'Truck',
    path: 'truck',
  },
  {
    name: 'Broker',
    path: 'shipper',
  },
  {
    name: 'Owner',
    path: 'owner',
  },
  {
    name: 'User',
    path: 'user',
  },
  {
    name: 'Contact',
    path: 'contact',
  },
  {
    name: 'Account',
    path: 'account',
  },
];
// Tools Navigation Data

export const toolsNavigationData: NavigationModal[] = [
  {
    name: 'Event',
    path: 'event',
  },
  {
    name: 'Task',
    path: 'task',
  },
];

// Repair Navigation Data
export const repairNavigationData: NavigationModal[] = [
  {
    name: 'Order',
    path: 'order',
  },
  {
    name: 'Shop',
    path: 'shop',
  },
];

// Fuel Navigation Data
export const fuelNavigationData: NavigationModal[] = [
  {
    name: 'Purchase',
    path: 'purchase',
  },
  {
    name: 'Stop',
    path: 'stop',
  },
];

// Safety Navigation Data
export const safetyNavigationData: NavigationModal[] = [
  {
    name: 'Violation',
    path: 'violation',
  },
  {
    name: 'Accident',
    path: 'accident',
  },
];

// Accounting Navigation Data
export const accountingNavigationData: NavigationModal[] = [
  {
    name: 'Credit',
    path: 'credit',
  },
  {
    name: 'Bonus',
    path: 'bonus',
  },
  {
    name: 'Deduction',
    path: 'deduction',
  },
  {
    name: 'Fuel',
    path: 'fuel',
  },
];
