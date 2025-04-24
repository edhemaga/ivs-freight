export interface NavigationSettings {
    id: number;
    image: string | any;
    qaId?: string;
    text: string | {};
    route?: any;
    arrow?: string;
    isRouteActive?: boolean;
    isSubrouteActive?: boolean;
}
