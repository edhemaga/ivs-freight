import { NavigationModel } from '../../state/model/navigation.model';

export const NAVBAR_MENU_ITEMS: NavigationModel[] = [
    {
        title: 'Features',
        iconSrc: 'assets/svg/website/arrow-down.svg',
        route: '/features',
    },
    {
        title: 'Pricing',
        route: '/pricing',
    },
    {
        title: 'Support',
        route: '/support',
    },
    {
        title: 'Login',
    },
    {
        title: 'Start Trial',
    },
];
