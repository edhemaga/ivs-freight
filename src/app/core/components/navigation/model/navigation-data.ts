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
    route: '/dispatcher',
    isRouteActive: false,
  },
  {
    id: 3,
    name: 'List',
    image: 'assets/img/svgs/navigation/ic_list.svg',
    arrow: 'assets/img/svgs/navigation/ic_arrow.svg',
    isRouteActive: false,
    isSubrouteActive: false,
    route: [
      {
        name: 'Load',
        route: '/load',
        activeRouteFlegId: 3  // for active sub-route to know which sub-route list is active
      },
      {
        name: 'Customer',
        route: '/customer',
        activeRouteFlegId: 3
      },
      {
        name: 'Driver',
        route: '/driver',
        activeRouteFlegId: 3
      },
      {
        name: 'Truck',
        route: '/truck',
        activeRouteFlegId: 3
      },
      {
        name: 'Trailer',
        route: '/trailer',
        activeRouteFlegId: 3
      },
      {
        name: 'Repair',
        route: '/repair',
        activeRouteFlegId: 3
      },
      // List Fuel route ?
      {
        name: 'Fuel',
        route: '/accounting/fuel',
        activeRouteFlegId: 3
      },
      {
        name: 'Owner',
        route: '/owner',
        activeRouteFlegId: 3
      },
      {
        name: 'Account',
        route: '/account',
        activeRouteFlegId: 3
      },
      {
        name: 'Contact',
        route: '/contact',
        activeRouteFlegId: 3
      },
    ],
  },
  {
    id: 4,
    name: 'Accounting',
    image: 'assets/img/svgs/navigation/ic_accounting.svg',
    arrow: 'assets/img/svgs/navigation/ic_arrow.svg',
    isRouteActive: false,
    isSubrouteActive: false,
    route: [
      {
        name: 'Payroll',
        route: '/accounting/payroll',
        activeRouteFlegId: 4
      },
      {
        name: 'IFTA',
        route: '/accounting/ifta',
        activeRouteFlegId: 4
      },
      {
        name: 'Ledger',
        route: '/accounting/ledger',
        activeRouteFlegId: 4
      },
      {
        name: 'Tax',
        route: '/accounting/tax',
        activeRouteFlegId: 4
      },
    ],
  },
  {
    id: 5,
    name: 'Safety',
    image: 'assets/img/svgs/navigation/ic_safety.svg',
    arrow: 'assets/img/svgs/navigation/ic_arrow.svg',
    isRouteActive: false,
    isSubrouteActive: false,
    route: [
      {
        name: 'Violation',
        route: '/safety/violation',
        activeRouteFlegId: 5
      },
      {
        name: 'Accident',
        route: '/safety/accident',
        activeRouteFlegId: 5
      },
      {
        name: 'Log',
        route: '/safety/log',
        activeRouteFlegId: 5
      },
      {
        name: 'Scheduled Ins.',
        route: '/safety/scheduled-insurance',
        activeRouteFlegId: 5
      },
    ],
  },
  {
    id: 6,
    name: 'Tools',
    image: 'assets/img/svgs/navigation/ic_tools.svg',
    arrow: 'assets/img/svgs/navigation/ic_arrow.svg',
    isRouteActive: false,
    isSubrouteActive: false,
    route: [
      {
        name: 'Miles',
        route: '/tools/miles',
        activeRouteFlegId: 6
      },
      {
        name: 'MVR',
        route: '/tools/mvr',
        activeRouteFlegId: 6
      },
      {
        name: 'Calendar',
        route: '/tools/calendar',
        activeRouteFlegId: 6
      },
      {
        name: 'To-Do',
        route: '/tools/todo',
        activeRouteFlegId: 6
      },
      {
        name: '1099',
        route: '/tools/1099',
        activeRouteFlegId: 6
      },
      {
        name: '2290',
        route: '/tools/2290',
        activeRouteFlegId: 6
      },
      {
        name: 'Factoring',
        route: '/tools/factoring',
        activeRouteFlegId: 6
      },
      {
        name: 'Fax',
        route: '/tools/fax',
        activeRouteFlegId: 6
      },
      {
        name: 'SMS',
        route: '/tools/sms',
        activeRouteFlegId: 6
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
    route: '/statistic/load',
    isRouteActive: false,
  },
  {
    id: 10,
    name: 'Chat',
    image: 'assets/img/svgs/navigation/ic_chat.svg',
    route: '/communicator',
    isRouteActive: false,
  },
  {
    id: 11,
    name: 'GPS',
    image: 'assets/img/svgs/navigation/ic_gps.svg',
    route: '/gpstracking',
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
    name: 'User status',
    image: 'assets/img/svgs/navigation/ic_truckassist_busy_status.svg',
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
  // ROUTE WHAT'S NEW ?
  {
    id: 1,
    image: 'assets/img/svgs/navigation/ic_info.svg',
    text: "What's New",
    route: '/whatsnew',
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
