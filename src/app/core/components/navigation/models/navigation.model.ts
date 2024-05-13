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
    construction?: boolean;
}
