import { NavigationModel } from '@pages/website/models/navigation.model';

export class WebsiteConstants {
    static NAVBAR_MENU_ITEMS: NavigationModel[] = [
        {
            title: 'Features',
            iconSrc: 'assets/svg/website/arrow-down.svg',
            route: '/website/features',
        },
        {
            title: 'Pricing',
            route: '/website/pricing',
        },
        {
            title: 'Support',
            route: '/website/support',
        },
        {
            title: 'Login',
        },
        {
            title: 'Start Trial',
        },
    ];
}
