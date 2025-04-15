// models
import {
    NavigationModal,
    NavigationUserPanel,
    NavigationFooterData,
    Navigation,
    NavigationSettings,
} from '@core/components/navigation/models';

// enums
import { eGeneralActions } from '@shared/enums';

// environments
import { environment } from 'src/environments/environment';

export class NavigationDataConstants {
    static title = 'Add New';
    static close = 'Close';
    static navigationData: Navigation[] = [
        {
            id: 1,
            name: 'Dashboard',
            image: 'ic_dashboard.svg',
            route: '/dashboard',
            isRouteActive: false,
            qaId: 'navbar_dashboard',
        },
        {
            id: 2,
            name: 'Dispatch Board',
            image: 'ic_dispatch.svg',
            route: '/dispatcher',
            construction: false,
            isRouteActive: true,
            qaId: 'navbar_dispatch_board',
        },
        {
            id: 3,
            name: 'List',
            image: 'ic_list.svg',
            arrow: 'assets/svg/common/ic_arrow-down.svg',
            isRouteActive: false,
            isSubrouteActive: false,
            qaId: 'navbar_list',
            route: [
                {
                    name: 'Load',
                    route: '/list/load',
                    qaId: 'navbar_list_load',
                    activeRouteFlegId: 3, // for active sub-route to know which sub-route list is active
                },
                {
                    name: 'Customer',
                    route: '/list/customer',
                    qaId: 'navbar_list_customer',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'Driver',
                    route: '/list/driver',
                    qaId: 'navbar_list_driver',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'Truck',
                    route: '/list/truck',
                    qaId: 'navbar_list_truck',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'Trailer',
                    route: '/list/trailer',
                    qaId: 'navbar_list_trailer',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'Repair',
                    route: '/list/repair',
                    qaId: 'navbar_list_repair',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'PM',
                    route: '/list/pm',
                    qaId: 'navbar_list_pm',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'Fuel',
                    route: '/list/fuel',
                    qaId: 'navbar_list_fuel',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'Owner',
                    route: '/list/owner',
                    qaId: 'navbar_list_owner',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'Rentor',
                    route: '/list/rentor',
                    qaId: 'navbar_list_rentor',
                    activeRouteFlegId: 3,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Account',
                    route: '/list/account',
                    qaId: 'navbar_list_account',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'Contact',
                    route: '/list/contact',
                    qaId: 'navbar_list_contact',
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
            qaId: 'navbar_accounting',
            route: [
                {
                    name: 'Payroll',
                    route: '/accounting/payroll',
                    qaId: 'navbar_account_payroll',
                    activeRouteFlegId: 4,
                },
                {
                    name: 'IFTA',
                    route: '/accounting/ifta',
                    qaId: 'navbar_account_ifta',
                    activeRouteFlegId: 4,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Ledger',
                    route: '/accounting/ledger',
                    qaId: 'navbar_account_ledger',
                    activeRouteFlegId: 4,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Tax',
                    route: '/accounting/tax',
                    qaId: 'navbar_account_tax',
                    activeRouteFlegId: 4,
                    construction: environment.staging || environment.production,
                },
            ],
        },
        {
            id: 5,
            name: 'Safety',
            image: 'ic_safety.svg',
            arrow: 'assets/svg/common/ic_arrow-down.svg',
            isRouteActive: false,
            construction: environment.staging || environment.production,
            isSubrouteActive: false,
            qaId: 'navbar_safety',
            route: [
                {
                    name: 'Violation',
                    route: '/safety/violation',
                    qaId: 'navbar_safety_violation',
                    activeRouteFlegId: 5,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Accident',
                    route: '/safety/accident',
                    qaId: 'navbar_safety_accident',
                    activeRouteFlegId: 5,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Log',
                    route: '/safety/log',
                    qaId: 'navbar_safety_log',
                    activeRouteFlegId: 5,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Scheduled Ins.',
                    route: '/safety/scheduled-insurance',
                    qaId: 'navbar_safety_scheduled-insurance',
                    activeRouteFlegId: 5,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'MVR',
                    route: '/safety/mvr',
                    qaId: 'navbar_safety_mvr',
                    activeRouteFlegId: 5,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Test',
                    route: '/safety/test',
                    qaId: 'navbar_safety_test',
                    activeRouteFlegId: 5,
                    construction: environment.staging || environment.production,
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
            qaId: 'navbar_tools',
            route: [
                {
                    name: 'Miles',
                    route: '/tools/miles',
                    qaId: 'navbar_tools_miles',
                    activeRouteFlegId: 6,
                },
                {
                    name: 'Calendar',
                    route: '/tools/calendar',
                    qaId: 'navbar_tools_calendar',
                    activeRouteFlegId: 6,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'To-Do',
                    route: '/tools/todo',
                    qaId: 'navbar_tools_todo',
                    activeRouteFlegId: 6,
                    construction: environment.staging || environment.production,
                },
                {
                    name: '1099',
                    route: '/tools/1099',
                    qaId: 'navbar_tools_1099',
                    activeRouteFlegId: 6,
                    construction: environment.staging || environment.production,
                },
                {
                    name: '2290',
                    route: '/tools/2290',
                    qaId: 'navbar_tools_2290',
                    activeRouteFlegId: 6,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Factoring',
                    route: '/tools/factoring',
                    qaId: 'navbar_tools_factoring',
                    activeRouteFlegId: 6,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Fax',
                    route: '/tools/fax',
                    qaId: 'navbar_tools_fax',
                    activeRouteFlegId: 6,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'SMS',
                    route: '/tools/sms',
                    qaId: 'navbar_tools_sms',
                    activeRouteFlegId: 6,
                    construction: environment.staging || environment.production,
                },
            ],
        },
        {
            id: 7,
            name: 'Routing',
            image: 'ic_routing.svg',
            route: '/routing',
            isRouteActive: false,
            construction: environment.staging || environment.production,
            qaId: 'navbar_routing',
        },
        {
            id: 8,
            name: 'Report',
            image: 'ic_report.svg',
            route: 'report',
            isRouteActive: false,
            construction: environment.staging || environment.production,
            qaId: 'navbar_report',
        },
        {
            id: 9,
            name: 'Statistics',
            image: 'ic_statistic.svg',
            route: 'statistic' /* /statistic/load -> Bilo je pre. Pravi problem load tabeli, nakon reloada, pokusava da vodi ka ovoj ruti, posto ne postoji prebaci se na dashboard */,
            isRouteActive: false,
            construction: environment.staging || environment.production,
            qaId: 'navbar_statistic',
        },
        {
            id: 10,
            name: 'Chat',
            image: 'ic_chat.svg',
            route: 'chat',
            isRouteActive: true,
            messages: 5,
            construction: false,
            qaId: 'navbar_chat',
        },
        {
            id: 11,
            name: 'Telematics',
            image: 'ic_gps.svg',
            route: '/telematic',
            isRouteActive: false,
            construction: environment.staging || environment.production,
            qaId: 'navbar_telematics',
        },
        {
            id: 12,
            name: 'Places',
            image: 'ic_places-new.svg',
            route: 'places',
            isRouteActive: false,
            construction: environment.staging || environment.production,
            qaId: 'navbar_places',
        },
        {
            id: 13,
            name: 'File Manager',
            image: 'ic_file_manager-new.svg',
            route: 'file-manager',
            isRouteActive: false,
            files: 83,
            construction: environment.staging || environment.production,
            qaId: 'navbar_file_manager',
        },
        {
            id: 34,
            image: 'ic_company.svg',
            name: 'Company',
            arrow: 'assets/svg/common/ic_arrow-down.svg',
            isRouteActive: false,
            isSubrouteActive: false,
            qaId: 'navbar_company',
            route: [
                {
                    name: 'Settings',
                    image: 'ic_settings.svg',
                    route: '/company/settings',
                    activeRouteFlegId: 34,
                    qaId: 'navbar_company_settings',
                },
                {
                    name: 'Location',
                    image: 'ic_location.svg',
                    route: '/company/location',
                    activeRouteFlegId: 34,
                    qaId: 'navbar_company_location',
                },
                {
                    name: 'Document',
                    image: 'ic_document.svg',
                    route: '/company/document',
                    activeRouteFlegId: 34,
                    qaId: 'navbar_company_document',
                },
                {
                    name: 'User',
                    image: 'ic_user.svg',
                    route: '/company/user',
                    construction: false,
                    activeRouteFlegId: 34,
                    qaId: 'navbar_company_user',
                },
                {
                    name: 'Custom Agreement',
                    image: 'case.svg',
                    route: '/custom-agreement',
                    construction: environment.staging || environment.production,
                    activeRouteFlegId: 34,
                    qaId: 'navbar_company_custom-agreement',
                },
                {
                    name: 'Training Material',
                    image: 'book.svg',
                    route: '/training-material',
                    activeRouteFlegId: 34,
                    construction: environment.staging || environment.production,
                    qaId: 'navbar_company_training-material',
                },
                {
                    name: 'Billing',
                    image: 'ic_billing.svg',
                    route: '/billing',
                    activeRouteFlegId: 34,
                    construction: environment.staging || environment.production,
                    qaId: 'navbar_company_billing',
                },
                {
                    name: 'Integration',
                    image: 'ic_integration.svg',
                    route: '/integration',
                    activeRouteFlegId: 34,
                    construction: environment.staging || environment.production,
                    qaId: 'navbar_company_integration',
                },
            ],
        },
    ];

    static generalNavigationData: NavigationModal[] = [
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

    static toolsNavigationData: NavigationModal[] = [
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

    static repairNavigationData: NavigationModal[] = [
        {
            id: 15,
            name: 'Bill / Order',
            path: 'repair-order',
        },
        {
            id: 16,
            name: 'Shop',
            path: 'repair-shop',
        },
    ];

    static fuelNavigationData: NavigationModal[] = [
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

    static safetyNavigationData: NavigationModal[] = [
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

    static accountingNavigationData: NavigationModal[] = [
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

    static requestNavigationData: NavigationModal[] = [
        {
            id: 27,
            name: 'MVR',
            path: 'mvr-request',
        },
        {
            id: 28,
            name: 'Test',
            path: 'test-request',
        },
        {
            id: 29,
            name: 'Medical',
            path: 'medical-request',
        },
        {
            id: 30,
            name: 'BG Check',
            path: 'bg-check',
        },
    ];

    static userNavigationData: NavigationUserPanel[] = [
        {
            id: 27,
            name: 'Profile Update',
            image: 'ic_pen.svg',
            action: eGeneralActions.UPDATE,
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
        // {
        //     id: 30,
        //     name: 'Help Center',
        //     image: 'ic_helpcenter.svg',
        //     action: 'help',
        // },
        {
            id: 30,
            name: 'Logout',
            image: 'ic_exit.svg',
            action: 'logout',
        },
    ];

    static footerData: NavigationFooterData[] = [
        {
            id: 32,
            image: 'assets/svg/common/ic_bell.svg',
            text: 'Notifications',
            isRouteActive: false,
            route: '/notifications',
            notification: 50,
            construction: environment.staging || environment.production,
        },
        {
            id: 33,
            image: '',
            text: '',
            isRouteActive: false,
            route: '',
        },
    ];

    static settings: NavigationSettings[] = [
        {
            id: 34,
            image: 'assets/svg/common/ic_company.svg',
            text: 'Company',
            arrow: 'assets/svg/common/ic_arrow-down.svg',
            isRouteActive: false,
            isSubrouteActive: false,
            qaId: 'navbar_company',
            route: [
                {
                    name: 'Settings',
                    image: 'assets/svg/common/ic_settings.svg',
                    route: '/settings',
                    activeRouteFlegId: 34,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Location',
                    image: 'assets/svg/common/ic_location.svg',
                    route: '/location',
                    activeRouteFlegId: 34,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Document',
                    image: 'assets/svg/common/ic_document.svg',
                    route: '/document',
                    activeRouteFlegId: 34,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Custom Agreement',
                    image: 'assets/svg/applicant/case.svg',
                    route: '/custom-agreement',
                    construction: environment.staging || environment.production,
                    activeRouteFlegId: 34,
                },
            ],
        },
    ];

    static footerNavigation: Navigation[] = [
        {
            id: 34,
            image: 'ic_company.svg',
            name: 'Company',
            arrow: 'assets/svg/common/ic_arrow-down.svg',
            isRouteActive: false,
            isSubrouteActive: false,
            qaId: 'navbar_company',
            route: [
                {
                    name: 'Settings',
                    image: 'ic_settings.svg',
                    route: '/company/settings',
                    activeRouteFlegId: 34,
                },
                {
                    name: 'Location',
                    image: 'ic_location.svg',
                    route: '/company/location',
                    activeRouteFlegId: 34,
                },
                {
                    name: 'Document',
                    image: 'ic_document.svg',
                    route: '/company/document',
                    activeRouteFlegId: 34,
                },
                {
                    name: 'Custom Agreement',
                    image: 'assets/svg/applicant/case.svg',
                    route: '/custom-agreement',
                    construction: environment.staging || environment.production,
                    activeRouteFlegId: 34,
                },
            ],
        },
    ];

    static icons = {
        common: 'assets/svg/common/',
        newTab: 'assets/svg/common/arrow_top_right.svg',
        confirm: 'assets/svg/common/ic_confirm.svg',
        logo: 'assets/svg/logo.svg',
        logoText: 'assets/svg/logo-text.svg',
        search: 'assets/svg/common/ic_search.svg',
        plus: 'assets/svg/common/ic_plus.svg',
    };
}
