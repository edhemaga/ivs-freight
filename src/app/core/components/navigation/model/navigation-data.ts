import {
    FooterData,
    Navigation,
    NavigationModal,
    NavigationUserPanel,
    Settings
} from './navigation.model';

export const navigationData: Navigation[] = [
    {
        id: 1,
        name: 'Dashboard',
        image: 'ic_dashboard.svg',
        route: '/dashboard',
        isRouteActive: false,
    },
    {
        id: 2,
        name: 'Dispatch',
        image: 'ic_dispatch.svg',
        route: '/dispatcher',
        isRouteActive: false,
    },
    {
        id: 3,
        name: 'List',
        image: 'ic_list.svg',
        arrow: 'assets/svg/common/ic_arrow-down.svg',
        isRouteActive: false,
        isSubrouteActive: false,
        route: [
            {
                name: 'Load',
                route: '/load',
                activeRouteFlegId: 3, // for active sub-route to know which sub-route list is active
            },
            {
                name: 'Customer',
                route: '/customer',
                activeRouteFlegId: 3,
            },
            {
                name: 'Driver',
                route: '/driver',
                activeRouteFlegId: 3,
            },
            {
                name: 'Truck',
                route: '/truck',
                activeRouteFlegId: 3,
            },
            {
                name: 'Trailer',
                route: '/trailer',
                activeRouteFlegId: 3,
            },
            {
                name: 'Repair',
                route: '/repair',
                activeRouteFlegId: 3,
            },
            {
                name: 'PM',
                route: '/pm',
                activeRouteFlegId: 3,
            },
            {
                name: 'User',
                route: '/user',
                activeRouteFlegId: 3,
            },
            {
                name: 'Fuel',
                route: '/fuel',
                activeRouteFlegId: 3,
            },
            {
                name: 'Owner',
                route: '/owner',
                activeRouteFlegId: 3,
            },
            {
                name: 'Rentor',
                route: '/rentor',
                activeRouteFlegId: 3,
            },
            {
                name: 'Account',
                route: '/account',
                activeRouteFlegId: 3,
            },
            {
                name: 'Contact',
                route: '/contact',
                activeRouteFlegId: 3,
            },
        ],
    },
    {
        id: 4,
        name: 'Accounting',
        image: 'ic_accounting.svg',
        arrow: 'assets/svg/common/ic_arrow-down.svg',
        isRouteActive: false,
        isSubrouteActive: false,
        route: [
            {
                name: 'Payroll',
                route: '/accounting/payroll',
                activeRouteFlegId: 4,
            },
            {
                name: 'IFTA',
                route: '/accounting/ifta',
                activeRouteFlegId: 4,
            },
            {
                name: 'Ledger',
                route: '/accounting/ledger',
                activeRouteFlegId: 4,
            },
            {
                name: 'Tax',
                route: '/accounting/tax',
                activeRouteFlegId: 4,
            },
        ],
    },
    {
        id: 5,
        name: 'Safety',
        image: 'ic_safety.svg',
        arrow: 'assets/svg/common/ic_arrow-down.svg',
        isRouteActive: false,
        isSubrouteActive: false,
        route: [
            {
                name: 'Violation',
                route: '/safety/violation',
                activeRouteFlegId: 5,
            },
            {
                name: 'Accident',
                route: '/safety/accident',
                activeRouteFlegId: 5,
            },
            {
                name: 'Log',
                route: '/safety/log',
                activeRouteFlegId: 5,
            },
            {
                name: 'Scheduled Ins.',
                route: '/safety/scheduled-insurance',
                activeRouteFlegId: 5,
            },
            {
                name: 'MVR',
                route: '/safety/mvr',
                activeRouteFlegId: 5,
            },
            {
                name: 'Test',
                route: '/safety/test',
                activeRouteFlegId: 5,
            },
        ],
    },
    {
        id: 6,
        name: 'Tools',
        image: 'ic_tools.svg',
        arrow: 'assets/svg/common/ic_arrow-down.svg',
        isRouteActive: false,
        isSubrouteActive: false,
        route: [
            {
                name: 'Miles',
                route: '/tools/miles',
                activeRouteFlegId: 6,
            },
            {
                name: 'Calendar',
                route: '/tools/calendar',
                activeRouteFlegId: 6,
            },
            {
                name: 'To-Do',
                route: '/tools/todo',
                activeRouteFlegId: 6,
            },
            {
                name: '1099',
                route: '/tools/1099',
                activeRouteFlegId: 6,
            },
            {
                name: '2290',
                route: '/tools/2290',
                activeRouteFlegId: 6,
            },
            {
                name: 'Factoring',
                route: '/tools/factoring',
                activeRouteFlegId: 6,
            },
            {
                name: 'Fax',
                route: '/tools/fax',
                activeRouteFlegId: 6,
            },
            {
                name: 'SMS',
                route: '/tools/sms',
                activeRouteFlegId: 6,
            },
        ],
    },
    {
        id: 7,
        name: 'Routing',
        image: 'ic_routing.svg',
        route: '/routing',
        isRouteActive: false,
    },
    {
        id: 8,
        name: 'Report',
        image: 'ic_report.svg',
        route: '/report',
        isRouteActive: false,
    },
    {
        id: 9,
        name: 'Statistic',
        image: 'ic_statistic.svg',
        route: '/statistic' /* /statistic/load -> Bilo je pre. Pravi problem load tabeli, nakon reloada, pokusava da vodi ka ovoj ruti, posto ne postoji prebaci se na dashboard */,
        isRouteActive: false,
    },
    {
        id: 10,
        name: 'Chat',
        image: 'ic_chat.svg',
        route: '/communicator',
        isRouteActive: false,
        messages: 5
    },
    {
        id: 11,
        name: 'Telematic',
        image: 'ic_gps.svg',
        route: '/gpstracking',
        isRouteActive: false,
    },
    {
        id: 12,
        name: 'Places',
        image: 'ic_places-new.svg',
        route: '/places',
        isRouteActive: false,
    },
    {
        id: 13,
        name: 'File Manager',
        image: 'ic_file_manager-new.svg',
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
        name: 'LTL',
        path: 'ltl',
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
        name: 'Driver',
        path: 'driver',
    },
    {
        id: 6,
        name: 'User',
        path: 'user',
    },
    {
        id: 7,
        name: 'Broker',
        path: 'broker',
    },
    {
        id: 8,
        name: 'Shipper',
        path: 'shipper',
    },
    {
        id: 9,
        name: 'Owner',
        path: 'owner',
    },
    {
        id: 10,
        name: 'Rentor',
        path: 'rentor',
    },
    {
        id: 11,
        name: 'Contact',
        path: 'contact',
    },
    {
        id: 12,
        name: 'Account',
        path: 'account',
    },
    {
        id: 13,
        name: 'Applicant',
        path: 'applicant',
    },
];
// Tools Navigation Data

export const toolsNavigationData: NavigationModal[] = [
    {
        id: 11,
        name: 'Event',
        path: 'event',
    },
    {
        id: 12,
        name: 'Task',
        path: 'task',
    },
    {
        id: 13,
        name: 'Fax',
        path: 'fax',
    },
    {
        id: 14,
        name: 'SMS',
        path: 'sms',
    },
];

// Repair Navigation Data
export const repairNavigationData: NavigationModal[] = [
    {
        id: 15,
        name: 'Order',
        path: 'repair-order',
    },
    {
        id: 16,
        name: 'Shop',
        path: 'repair-shop',
    },
];

// Fuel Navigation Data
export const fuelNavigationData: NavigationModal[] = [
    {
        id: 17,
        name: 'Transaction',
        path: 'transaction',
    },
    {
        id: 18,
        name: 'Stop',
        path: 'fuel-stop',
    },
];

// Safety Navigation Data
export const safetyNavigationData: NavigationModal[] = [
    {
        id: 19,
        name: 'Accident',
        path: 'accident',
    },
    {
        id: 20,
        name: 'MVR',
        path: 'mvr',
    },
    {
        id: 21,
        name: 'Test',
        path: 'test',
    },
    {
        id: 22,
        name: 'Medical',
        path: 'medical',
    },
];

// Accounting Navigation Data
export const accountingNavigationData: NavigationModal[] = [
    {
        id: 23,
        name: 'Credit',
        path: 'credit',
    },
    {
        id: 24,
        name: 'Bonus',
        path: 'bonus',
    },
    {
        id: 25,
        name: 'Deduction',
        path: 'deduction',
    },
    {
        id: 26,
        name: 'Fuel',
        path: 'fuel',
    },
];

// User Navigation Data
export const userNavigationData: NavigationUserPanel[] = [
    {
        id: 27,
        name: 'Profile Update',
        image: 'ic_pen.svg',
        action: 'update',
    },
    {
        id: 28,
        name: 'User status',
        image: 'ic_disable-status.svg',
        action: 'status',
    },
    {
        id: 29,
        name: 'Switch Company',
        image: 'ic_company.svg',
        action: 'company',
    },
    {
        id: 30,
        name: 'Help Center',
        image: 'ic_helpcenter.svg',
        action: 'help',
    },
    {
        id: 31,
        name: 'Logout',
        image: 'assets/svg/common/ic_exit.svg',
        action: 'logout',
    },
];

export const footerData: FooterData[] = [
    // ROUTE WHAT'S NEW ?
    {
        id: 32,
        image: 'assets/svg/common/ic_bell.svg',
        text: "Notifications",
        isRouteActive: false,
        route: '/notification',
        notification: 50
    },
    {
        id: 34,
        image: '',
        text: "",
        isRouteActive: false,
        route: ''
    },
];
export const settings: Settings[] = [
    {
        id: 33,
        image: 'assets/svg/common/ic_settings.svg',
        text: 'Settings',
        arrow: 'assets/svg/common/ic_arrow-down.svg',
        isRouteActive: false,
        isSubrouteActive: false,
         route: [
            {
                name: 'Company',
                image: 'assets/svg/common/ic_company.svg',
                route: '/company',
                activeRouteFlegId: 34,
            },
            {
                name: 'Location',
                image: 'assets/svg/common/ic_location.svg',
                route: '/location',
                activeRouteFlegId: 35,
            },
            {
                name: 'Document',
                image: 'assets/svg/common/ic_document.svg',
                route: '/document',
                activeRouteFlegId: 36,
            },
            {
                name: 'User',
                image: 'assets/svg/common/ic_user.svg',
                route: '/user',
                activeRouteFlegId: 37,
            },
            {
                name: 'Custom Agreement',
                image: 'assets/svg/applicant/case.svg',
                route: '/custom_agreement',
                activeRouteFlegId: 38,
            },
            {
                name: 'Training Material',
                image: 'assets/svg/applicant/case.svg',
                route: '/training_material',
                activeRouteFlegId: 39,
            },
            {
                name: 'Billing',
                image: 'assets/svg/common/ic_billing.svg',
                route: '/billing',
                activeRouteFlegId: 40,
            },
            {
                name: 'Integration',
                image: 'assets/svg/common/ic_integration.svg',
                route: '/integration',
                activeRouteFlegId: 41,
            },
        ],
    },
]
