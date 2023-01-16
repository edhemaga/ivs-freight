export interface Navigation {
    id: number;
    name: string;
    image: string;
    route: any;
    arrow?: string;
    isRouteActive: boolean;
    isSubrouteActive?: boolean;
    messages?: number;
    files?: number;
}
export interface NavigationSubRoute {
    name: string;
    route: string;
}

export interface NavigationSubRoutes {
    routeId: number;
    routes: string | [];
    activeRouteFlegId?: number;
}
export interface NavigationModal {
    id: number;
    name: string;
    path: string;
}
export interface NavigationUserPanel {
    id: number;
    name: string;
    image: string;
    action: string;
}
export interface FooterData {
    id: number;
    image: string | any;
    text: string | {};
    route?: string;
    arrow?: string;
    isRouteActive?: boolean;
    notification?: number;
}
export interface Settings {
    id: number;
    image: string | any;
    text: string | {};
    route?: any;
    arrow?: string;
    isRouteActive?: boolean;
    isSubrouteActive?: boolean;
}
