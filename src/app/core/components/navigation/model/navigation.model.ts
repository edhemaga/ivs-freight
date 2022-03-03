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
    path: string
}

export interface NavigationUserPanel {
    name: string,
    image: string,
    action: string
}

export interface FooterData {
    id: number;
    image: string;
    text: string | {};
    route?: string;
  }