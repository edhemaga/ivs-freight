export interface Navigation {
    id: number,
    name: string,
    image: string,
    route: any,
    arrow?: string,
    isSubRouteActive?: boolean
}

export interface NavigationModal {
    name: string,
    route: string
}