export interface NavigationSettings {
    id: number;
    image: string | any;
    text: string | {};
    route?: any;
    arrow?: string;
    isRouteActive?: boolean;
    isSubrouteActive?: boolean;
}
