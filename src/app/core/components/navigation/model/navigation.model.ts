export interface Navigation {
  id: number;
  name: string;
  image: string;
  route?: any;
  arrow?: string;
  isRouteActive?: boolean;
}
export interface NavigationSubRoute {
  name: string;
  route: string;
}

export interface NavigationSubRoutes {
  routeId: number;
  routes: string | [];
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
  image: string;
  text: string | {};
  route?: string;
  isRouteActive?: boolean
}
