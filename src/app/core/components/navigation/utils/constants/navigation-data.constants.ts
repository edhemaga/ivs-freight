// models
import {
    NavigationModal,
    NavigationUserPanel,
    NavigationFooterData,
    Navigation,
    NavigationSettings,
} from '@core/components/navigation/models';

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
        },
        {
            id: 2,
            name: 'Dispatch Board',
            image: 'ic_dispatch.svg',
            route: '/dispatcher',
            construction: false,
            isRouteActive: true,
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
                    route: '/list/load',
                    activeRouteFlegId: 3, // for active sub-route to know which sub-route list is active
                },
                {
                    name: 'Customer',
                    route: '/list/customer',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'Driver',
                    route: '/list/driver',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'Truck',
                    route: '/list/truck',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'Trailer',
                    route: '/list/trailer',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'Repair',
                    route: '/list/repair',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'PM',
                    route: '/list/pm',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'Fuel',
                    route: '/list/fuel',
                    activeRouteFlegId: 3,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Owner',
                    route: '/list/owner',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'Rentor',
                    route: '/list/rentor',
                    activeRouteFlegId: 3,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Account',
                    route: '/list/account',
                    activeRouteFlegId: 3,
                },
                {
                    name: 'Contact',
                    route: '/list/contact',
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
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Ledger',
                    route: '/accounting/ledger',
                    activeRouteFlegId: 4,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Tax',
                    route: '/accounting/tax',
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
            route: [
                {
                    name: 'Violation',
                    route: '/safety/violation',
                    activeRouteFlegId: 5,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Accident',
                    route: '/safety/accident',
                    activeRouteFlegId: 5,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Log',
                    route: '/safety/log',
                    activeRouteFlegId: 5,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Scheduled Ins.',
                    route: '/safety/scheduled-insurance',
                    activeRouteFlegId: 5,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'MVR',
                    route: '/safety/mvr',
                    activeRouteFlegId: 5,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Test',
                    route: '/safety/test',
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
            construction: environment.staging || environment.production,
            route: [
                {
                    name: 'Miles',
                    route: '/tools/miles',
                    activeRouteFlegId: 6,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Calendar',
                    route: '/tools/calendar',
                    activeRouteFlegId: 6,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'To-Do',
                    route: '/tools/todo',
                    activeRouteFlegId: 6,
                    construction: environment.staging || environment.production,
                },
                {
                    name: '1099',
                    route: '/tools/1099',
                    activeRouteFlegId: 6,
                    construction: environment.staging || environment.production,
                },
                {
                    name: '2290',
                    route: '/tools/2290',
                    activeRouteFlegId: 6,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Factoring',
                    route: '/tools/factoring',
                    activeRouteFlegId: 6,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Fax',
                    route: '/tools/fax',
                    activeRouteFlegId: 6,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'SMS',
                    route: '/tools/sms',
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
        },
        {
            id: 8,
            name: 'Report',
            image: 'ic_report.svg',
            route: 'report',
            isRouteActive: false,
            construction: environment.staging || environment.production,
        },
        {
            id: 9,
            name: 'Statistics',
            image: 'ic_statistic.svg',
            route: 'statistic' /* /statistic/load -> Bilo je pre. Pravi problem load tabeli, nakon reloada, pokusava da vodi ka ovoj ruti, posto ne postoji prebaci se na dashboard */,
            isRouteActive: false,
            construction: environment.staging || environment.production,
        },
        {
            id: 10,
            name: 'Chat',
            image: 'ic_chat.svg',
            route: 'chat',
            isRouteActive: true,
            messages: 5,
            construction: false,
        },
        {
            id: 11,
            name: 'Telematics',
            image: 'ic_gps.svg',
            route: '/telematic',
            isRouteActive: false,
            construction: environment.staging || environment.production,
        },
        {
            id: 12,
            name: 'Places',
            image: 'ic_places-new.svg',
            route: 'places',
            isRouteActive: false,
            construction: environment.staging || environment.production,
        },
        {
            id: 13,
            name: 'File Manager',
            image: 'ic_file_manager-new.svg',
            route: 'file-manager',
            isRouteActive: false,
            files: 83,
            construction: environment.staging || environment.production,
        },
        {
            id: 34,
            image: 'ic_company.svg',
            name: 'Company',
            arrow: 'assets/svg/common/ic_arrow-down.svg',
            isRouteActive: false,
            isSubrouteActive: false,
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
                    name: 'User',
                    image: 'ic_user.svg',
                    route: '/company/user',
                    construction: false,
                    activeRouteFlegId: 34,
                },
                {
                    name: 'Custom Agreement',
                    image: 'case.svg',
                    route: '/custom-agreement',
                    construction: environment.staging || environment.production,
                    activeRouteFlegId: 34,
                },
                {
                    name: 'Training Material',
                    image: 'book.svg',
                    route: '/training-material',
                    activeRouteFlegId: 34,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Billing',
                    image: 'ic_billing.svg',
                    route: '/billing',
                    activeRouteFlegId: 34,
                    construction: environment.staging || environment.production,
                },
                {
                    name: 'Integration',
                    image: 'ic_integration.svg',
                    route: '/integration',
                    activeRouteFlegId: 34,
                    construction: environment.staging || environment.production,
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

    static UPLOAD_OPTIONS = {
        isVisibleCropAndDrop: true,
        files: [],
        slider: {
            dontUseSlider: false,
            hasCarouselBottomTabs: false,
        },
        carouselConfig: {
            files: [],
            customClass: 'medium',
            customDetailsPageClass: 'modals',
            hasCarouselBottomTabs: true,
        },
        hasCrop: true,
        isRoundCrop: true,
        containWithinAspectRatio: false,
        aspectRatio: [1, 1],
        initialCropperPosition: {
            x1: 0,
            y1: 0,
            x2: 184,
            y2: 184,
        },
        dropzoneConf: [
            {
                template: 'imageCropTemplate',
                config: {
                    dropzone: {
                        dropZoneType: 'image',
                        multiple: true,
                        globalDropZone: false,
                        dropZonePages: 'cdl',
                    },
                    dropzoneOption: {
                        customClassName: 'documents-dropzone',
                        size: 'medium',
                        modalSize: 'lg',
                        showDropzone: true,
                        dropzoneClose: false,
                    },
                },
            },
        ],
        review: {
            isReview: true,
            reviewMode: 'REVIEW_MODE',
            feedbackText: 'Sample feedback text',
            categoryTag: 'General',
        },
        configFile: {
            id: 111,
            customClassName: 'modals',
            file: {
                url: '',
                incorrect: false,
                lastHovered: false,
                fileSize: 1200,
                fileName: '',
            },
            hasTagsDropdown: false,
            hasNumberOfPages: true,
            activePage: 1,
            tags: ['Example'],
            type: 'modal',
            hasLandscapeOption: false,
            tagsOptions: [
                {
                    tagName: 'HOS Agreement',
                    checked: false,
                },
                {
                    tagName: 'Unsafe Driving AGT',
                    checked: false,
                },
            ],
        },
        size: 'medium',
        slideWidth: 180,
    };
}
