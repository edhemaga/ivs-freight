import {
  FooterData,
  Navigation,
  NavigationModal,
  NavigationUserPanel,
} from './navigation.model';

export const navigationData: Navigation[] = [
  {
    id: 1,
    name: 'Dashboard',
    image: 'assets/img/svgs/navigation/ic_dashboard.svg',
    route: '/dashboard',
    isRouteActive: false,
  },
  {
    id: 2,
    name: 'Dispatch',
    image: 'assets/img/svgs/navigation/ic_dispatch.svg',
    route: '/dispatch',
    isRouteActive: false,
  },
  {
    id: 3,
    name: 'List',
    image: 'assets/img/svgs/navigation/ic_list.svg',
    arrow: 'assets/img/svgs/navigation/ic_arrow.svg',
    isRouteActive: false,
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
    isRouteActive: false,
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
    isRouteActive: false,
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
    isRouteActive: false,
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
    isRouteActive: false,
  },
  {
    id: 8,
    name: 'Report',
    image: 'assets/img/svgs/navigation/ic_report.svg',
    route: '/report',
    isRouteActive: false,
  },
  {
    id: 9,
    name: 'Statistic',
    image: 'assets/img/svgs/navigation/ic_statistic.svg',
    route: '/statistic',
    isRouteActive: false,
  },
  {
    id: 10,
    name: 'Chat',
    image: 'assets/img/svgs/navigation/ic_chat.svg',
    route: '/chat',
    isRouteActive: false,
  },
  {
    id: 11,
    name: 'GPS',
    image: 'assets/img/svgs/navigation/ic_gps.svg',
    route: '/gps',
    isRouteActive: false,
  },
  {
    id: 12,
    name: 'Places',
    image: 'assets/img/svgs/navigation/ic_places.svg',
    route: '/places',
    isRouteActive: false,
  },
  {
    id: 13,
    name: 'File Manager',
    image: 'assets/img/svgs/navigation/ic_file_manager.svg',
    route: '/filemanager',
    isRouteActive: false,
  },
];

// General Navigation Data

export const generalNavigationData: NavigationModal[] = [
  {
    id: 1,
    name: 'Load',
    path: 'load',
  },
  {
    id: 2,
    name: 'Driver',
    path: 'driver',
  },
  {
    id: 3,
    name: 'Truck',
    path: 'truck',
  },
  {
    id: 4,
    name: 'Trailer',
    path: 'trailer',
  },
  {
    id: 5,
    name: 'Broker',
    path: 'broker',
  },
  {
    id: 6,
    name: 'Shipper',
    path: 'shipper',
  },
  {
    id: 7,
    name: 'Owner',
    path: 'owner',
  },
  {
    id: 8,
    name: 'User',
    path: 'user',
  },
  {
    id: 8,
    name: 'Contact',
    path: 'contact',
  },
  {
    id: 10,
    name: 'Account',
    path: 'account',
  },
];
// Tools Navigation Data

export const toolsNavigationData: NavigationModal[] = [
  {
    id: 1,
    name: 'Event',
    path: 'event',
  },
  {
    id: 2,
    name: 'Task',
    path: 'task',
  },
];

// Repair Navigation Data
export const repairNavigationData: NavigationModal[] = [
  {
    id: 1,
    name: 'Order',
    path: 'order',
  },
  {
    id: 2,
    name: 'Shop',
    path: 'shop',
  },
];

// Fuel Navigation Data
export const fuelNavigationData: NavigationModal[] = [
  {
    id: 1,
    name: 'Purchase',
    path: 'purchase',
  },
  {
    id: 2,
    name: 'Stop',
    path: 'stop',
  },
];

// Safety Navigation Data
export const safetyNavigationData: NavigationModal[] = [
  {
    id: 1,
    name: 'Violation',
    path: 'violation',
  },
  {
    id: 2,
    name: 'Accident',
    path: 'accident',
  },
];

// Accounting Navigation Data
export const accountingNavigationData: NavigationModal[] = [
  {
    id: 1,
    name: 'Credit',
    path: 'credit',
  },
  {
    id: 2,
    name: 'Bonus',
    path: 'bonus',
  },
  {
    id: 3,
    name: 'Deduction',
    path: 'deduction',
  },
  {
    id: 4,
    name: 'Fuel',
    path: 'fuel',
  },
];

// User Navigation Data
export const userNavigationData: NavigationUserPanel[] = [
  {
    id: 1,
    name: 'Profile Update',
    image: 'assets/img/svgs/navigation/ic_truckassist_pen.svg',
    action: 'update',
  },
  {
    id: 2,
    name: 'Set status',
    image: 'assets/img/svgs/navigation/ic_truckassist_pen.svg',
    action: 'status',
  },
  {
    id: 3,
    name: 'Switch Company',
    image: 'assets/img/svgs/navigation/ic_truckassist_company.svg',
    action: 'company',
  },
  {
    id: 4,
    name: 'Help Center',
    image: 'assets/img/svgs/navigation/ic_truckassist_help_center.svg',
    action: 'help',
  },
  {
    id: 5,
    name: 'Logout',
    image: 'assets/img/svgs/navigation/ic_truckassist_logout.svg',
    action: 'logout',
  },
];

export const footerData: FooterData[] = [
  {
    id: 1,
    image: 'assets/img/svgs/navigation/ic_info.svg',
    text: "What's New",
    route: '/new',
    isRouteActive: false,
  },
  {
    id: 2,
    image: 'assets/img/svgs/navigation/ic_settings.svg',
    text: 'Settings',
    route: '/settings',
    isRouteActive: false,
  },
  {
    id: 3,
    image: 'assets/img/svgs/navigation/ic_profile_user.svg',
    text: {
      companyName: '',
      userName: '',
    },
  },
];
